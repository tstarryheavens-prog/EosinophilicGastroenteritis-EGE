#!/usr/bin/env node
/**
 * sitemap の lastmod を作る。データ源は git 履歴のみ (= D1 も外部DBも使わない)。
 *
 *  - `npm run build` 前に prebuild として自動実行される
 *  - 固定ページ: その画面を決めているソースの最終コミット日
 *  - ラボ個別ページ: src/data/divisions.ts 内の該当ブロックを git blame し、
 *    そのブロックの最終更新日 (= ラボごとに違う日付になる)
 *  - git が無い環境(アップロードのみのビルド等)では既存の lastmod.json をそのまま残す
 *  - 生成物: src/data/lastmod.json  { generated_at, dates: { "/path": "YYYY-MM-DD" } }
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/lastmod.json");
const DIV_FILE = "src/data/divisions.ts";

/** 各URLの内容を決めているソースファイル。ここを直せば lastmod も動く。 */
const SOURCES = {
  "/": ["src/pages/index.astro", "src/layouts/BaseLayout.astro"],
  "/articles": [
    "src/pages/articles/index.astro",
    "src/pages/articles/[slug].astro",
    "src/data/articles.ts",
  ],
  "/divisions": ["src/pages/divisions/index.astro", "src/data/divisions.ts"],
  "/craft": ["src/pages/craft.astro"],
  "/contact": ["src/pages/contact.astro"],
  "/privacy": ["src/pages/privacy.astro"],
};

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

function hasGit() {
  try {
    return git(["rev-parse", "--is-inside-work-tree"]) === "true";
  } catch {
    return false;
  }
}

/** 複数ファイルのうち最も新しいコミット日(YYYY-MM-DD)。 */
function gitDate(files) {
  let best = null;
  for (const f of files) {
    if (!existsSync(resolve(ROOT, f))) continue;
    try {
      const d = git(["log", "-1", "--format=%ad", "--date=short", "--", f]);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!best || d > best)) best = d;
    } catch {
      /* 追跡外ファイルは無視 */
    }
  }
  return best;
}

/** epoch 秒 → ローカル日付 (YYYY-MM-DD)。 */
function ymd(epochSec) {
  const d = new Date(epochSec * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** divisions.ts 内の `'id': { ... }` ブロックの行範囲。 */
function divisionBlocks() {
  const abs = resolve(ROOT, DIV_FILE);
  if (!existsSync(abs)) return [];
  const lines = readFileSync(abs, "utf8").split("\n");
  const startRe = /^ {2}['"]([a-z0-9-]+)['"]:\s*\{\s*$/;
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(startRe);
    if (!m) continue;
    let depth = 0;
    let end = -1;
    for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      if (depth <= 0) {
        end = j;
        break;
      }
    }
    if (end > i) blocks.push({ id: m[1], start: i + 1, end: end + 1 });
  }
  return blocks;
}

/** 指定行範囲の最終コミット日(author date)。ラボ単位の粒度を出すために使う。 */
function blameDate(file, start, end) {
  try {
    const out = execFileSync(
      "git",
      ["blame", "--line-porcelain", "-L", `${start},${end}`, "--", file],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }
    );
    let max = 0;
    for (const m of out.matchAll(/^author-time (\d+)$/gm)) {
      const t = Number(m[1]);
      if (t > max) max = t;
    }
    return max ? ymd(max) : null;
  } catch {
    return null;
  }
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { dates: {} };

if (!hasGit()) {
  console.log("[lastmod] git が無いため既存の lastmod.json を保持します:", OUT);
  process.exit(0);
}

const dates = { ...(previous.dates || {}) };
let filled = 0;
for (const [path, files] of Object.entries(SOURCES)) {
  const d = gitDate(files);
  if (d) {
    dates[path] = d;
    filled++;
  } else if (!dates[path]) {
    console.warn(`[lastmod] ${path}: 日付を特定できず lastmod を省略します`);
  }
}

// ラボ個別ページ: ブロック単位の blame で「そのラボが最後に動いた日」を出す
const blocks = divisionBlocks();
let labFilled = 0;
for (const b of blocks) {
  const d = blameDate(DIV_FILE, b.start, b.end);
  if (d) {
    dates[`/divisions/${b.id}`] = d;
    labFilled++;
  } else {
    console.warn(`[lastmod] /divisions/${b.id}: 日付不明 → /divisions の日付で代替`);
  }
}
// ページが無くなったURLの lastmod は残さない
for (const key of Object.keys(dates)) {
  if (key.startsWith("/divisions/") && !blocks.some((b) => `/divisions/${b.id}` === key)) {
    delete dates[key];
  }
}

// 比較は日付だけ。コミットのたびに差分が出ると毎ビルドでツリーが汚れるため、
// HEAD が進んだだけでは書き換えない。
const legacyHead = Object.prototype.hasOwnProperty.call(previous || {}, "git_head");
const unchanged =
  !legacyHead && JSON.stringify(previous?.dates || {}) === JSON.stringify(dates);
if (unchanged) {
  console.log(`[lastmod] 変更なし — ${OUT} は触りません`);
  process.exit(0);
}

const payload = {
  generated_at: new Date().toISOString(),
  dates,
};
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(
  `[lastmod] 固定 ${filled}/${Object.keys(SOURCES).length} 件 + ラボ ${labFilled}/${blocks.length} 件を更新 → ${OUT}`
);
