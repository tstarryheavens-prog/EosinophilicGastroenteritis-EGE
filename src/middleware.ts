import { defineMiddleware } from "astro:middleware";
import { ARTICLES } from "./data/articles";
import { EMDASH_ADMIN_SHELL_HTML } from "./data/emdash_admin_shell";
import {
  OPS_UI_PREFIXES,
  OPS_PRIVATE_API_PREFIXES,
  OPS_WRITE_API_PREFIXES,
  OPS_WRITE_METHODS,
  OPS_OPEN_ASSET_PREFIXES,
  OPS_COOKIE,
  OPS_TOKEN_ENV_KEYS,
  OPS_TOKEN_HASH_ENV_KEYS,
  OPS_TOKEN_SHA256,
} from "./data/ops_config";
import {
  INTERNAL_SITE_IDS,
  isInternalSiteId,
  isInternalSlug,
  isPublicArticle,
} from "./data/public_scope";

const WRITE_METHODS = new Set(OPS_WRITE_METHODS);

/** 現行ビルドの識別子。検査スクリプトはこれを検出して Edge の旧キャッシュ応答を区別する。 */
const BOUNDARY_REV = "2026-11-06a";

/** Cloudflare Pages / wrangler 環境の変数集合を可能な限り解決する */
async function resolveRuntimeEnv(context: any): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const candidates: any[] = [];
  try {
    const loc = context?.locals?.runtime?.env;
    if (loc) candidates.push(loc);
  } catch {}
  try {
    const { env } = await import("cloudflare:workers" as any);
    if (env) candidates.push(env);
  } catch {}
  try {
    const proc = (globalThis as any).process?.env;
    if (proc) candidates.push(proc);
  } catch {}
  for (const key of [...OPS_TOKEN_ENV_KEYS, ...OPS_TOKEN_HASH_ENV_KEYS]) {
    if (out[key]) continue;
    for (const c of candidates) {
      const value = c?.[key];
      if (typeof value === "string" && value.trim().length > 0) {
        out[key] = value.trim();
        break;
      }
    }
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 期待するハッシュを環境から決める（平文トークンが設定されていればそれをハッシュ化） */
async function resolveExpectedHash(env: Record<string, string>): Promise<string> {
  for (const key of OPS_TOKEN_HASH_ENV_KEYS) {
    const value = env[key];
    if (value) return value.toLowerCase();
  }
  for (const key of OPS_TOKEN_ENV_KEYS) {
    const value = env[key];
    if (value) return sha256Hex(value);
  }
  return OPS_TOKEN_SHA256.toLowerCase();
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function readCandidateTokens(request: Request, query: URLSearchParams): string[] {
  const found: string[] = [];
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) found.push(auth.slice(7).trim());
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${OPS_COOKIE}=([^;]+)`));
  if (match) {
    try {
      found.push(decodeURIComponent(match[1]));
    } catch {
      found.push(match[1]);
    }
  }
  const legacy = request.headers.get("x-ops-token") || "";
  if (legacy) found.push(legacy.trim());
  const queryToken = query.get("ops_token");
  if (queryToken) found.push(queryToken.trim());
  return found.filter((v) => v.length > 0);
}

function blockedResponse(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "private, no-store, max-age=0",
      "cdn-cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
      "x-boundary-rev": BOUNDARY_REV,
      "x-handled-by": "smartailife-public-boundary",
    },
  });
}

function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: "ops_token_required",
      hint: "このエンドポイントへの書き込みには運営者トークンが必要です。ヘッダーに 'Authorization: Bearer <SLA_OPS_TOKEN>' を付けてください（ai_company/scripts/emdash_auth.py を import すれば自動付与されます）。",
    }),
    {
      status: 401,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "private, no-store, max-age=0",
        "cdn-cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
        "www-authenticate": "Bearer",
        "x-boundary-rev": BOUNDARY_REV,
        "x-handled-by": "smartailife-public-boundary",
      },
    }
  );
}

export const onRequest = defineMiddleware(async (context: any, next: any) => {
  if (!context.locals) {
    (context as any).locals = {};
  }
  (context.locals as any).middlewareRan = true;

  const url = context.url || new URL(context.request.url);
  const path = url.pathname;
  const normalizedPath = path.replace(/\/+$/, "") || "/";
  const method = (context.request.method || "GET").toUpperCase();

  // =====================================================================
  // ⓪ 内部専用コンテンツ（モータ学術論文など）は公開面で一切出さない
  //   運営面 (NAS HUD http://192.168.2.100:8899 / NAS WebUI :8520) でのみ扱う。
  //   テーマページ・記事スラッグ・?site= 絞り込みのいずれで辿っても 404。
  // =====================================================================
  const querySite = (url.searchParams.get("site") || url.searchParams.get("site_id") || "").trim();
  const articleTail = normalizedPath.startsWith("/articles/")
    ? (() => {
        const raw = normalizedPath.slice("/articles/".length);
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })()
    : "";
  const internalContentHit =
    INTERNAL_SITE_IDS.some(
      (id) => normalizedPath === `/${id}` || normalizedPath === `/post_${id}` ||
        normalizedPath === `/divisions/${id}` || normalizedPath.startsWith(`/divisions/${id}/`)
    ) ||
    INTERNAL_SITE_IDS.includes(querySite) ||
    isInternalSlug(articleTail) ||
    isInternalSlug(normalizedPath.replace(/^\/+/, "").replace(/^post_/, ""));
  if (internalContentHit) {
    return blockedResponse();
  }

  const cookieHeader = context.request.headers.get("cookie") || "";
  let needsClearCookie = false;
  if (
    cookieHeader.includes("emdash_session=potoru_admin_secret_2026") ||
    (cookieHeader.includes("emdash_session=") && !cookieHeader.includes("emdash_session=s:"))
  ) {
    needsClearCookie = true;
  }

  // =====================================================================
  // ① 公開/運営 境界ゲート（最優先）
  //   - 運営UI / 内部API  : トークンが無ければ 404（存在自体を見せない）
  //   - 記事APIの書き込み : GET等は公開、POST/PUT/DELETE は 401 で拒否
  //   認証: Authorization: Bearer *** / Cookie sla_ops / x-ops-token / ?ops_token=
  // =====================================================================
  const isOpenAsset = OPS_OPEN_ASSET_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
  const isUiOps = !isOpenAsset && OPS_UI_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
  const isPrivateApi =
    !isOpenAsset && OPS_PRIVATE_API_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
  const isWriteApi =
    !isOpenAsset &&
    WRITE_METHODS.has(method) &&
    OPS_WRITE_API_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));

  if ((isUiOps || isPrivateApi || isWriteApi) && method !== "OPTIONS") {
    const env = await resolveRuntimeEnv(context);
    const expectedHash = await resolveExpectedHash(env);
    const provided = readCandidateTokens(context.request, url.searchParams);
    let authorized = false;
    for (const token of provided) {
      const hash = await sha256Hex(token);
      if (constantTimeEquals(hash, expectedHash)) {
        authorized = true;
        break;
      }
    }
    if (!authorized) {
      return isPrivateApi || isWriteApi ? unauthorizedResponse() : blockedResponse();
    }
    (context.locals as any).opsAuthorized = true;
  }

  // CORS プリフライトは下流 ([...catchall].ts) に委譲
  if (method === "OPTIONS") {
    return next();
  }

  // =====================================================================
  // ② EmDash 管理画面 SPA シェル（認証済み運営者のみ）
  // =====================================================================
  if (normalizedPath.startsWith("/_emdash/admin")) {
    const res = new Response(EMDASH_ADMIN_SHELL_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store, max-age=0",
        "cdn-cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
        "x-boundary-rev": BOUNDARY_REV,
        "x-handled-by": "smartailife-middleware-admin-spa",
      },
    });
    res.headers.append("Set-Cookie", "emdash-locale=ja; Path=/; SameSite=Lax; Max-Age=31536000");
    if (needsClearCookie) {
      res.headers.append("Set-Cookie", "emdash_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    }
    return res;
  }

  // =====================================================================
  // ③ ルート直下の記事スラッグ (/:slug) を /articles/:slug へ正規化転送
  // =====================================================================
  const isApi = path.startsWith("/api/") || path.startsWith("/_emdash/api/");
  const isAsset = path.includes(".") && !path.endsWith("/");
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  if (
    cleanPath &&
    !cleanPath.includes("/") &&
    !isApi &&
    !isAsset &&
    !["articles", "_emdash", "mcp-showcase", "privacy", "contact", "divisions", "ops-login", "company", "craft"].includes(cleanPath)
  ) {
    const cleanSlug = cleanPath.replace(/^post_/, "");
    const isArticle = ARTICLES.some((a: any) => a.slug === cleanPath || a.slug === cleanSlug);
    if (isArticle) {
      return context.redirect(`${url.origin}/articles/${cleanSlug}`, 308);
    }
  }

  // =====================================================================
  // ④ 末尾スラッシュ正規化リダイレクト
  // =====================================================================
  if (!isApi && !isAsset && !path.endsWith("/") && path !== "" && path.startsWith("/_emdash")) {
    const redirectUrl = new URL(context.request.url);
    redirectUrl.pathname = path + "/";
    return context.redirect(redirectUrl.toString(), 308);
  }

  const response = await next();

  // 現行ビルドの応答であることを検査側が判定できるよう、全応答にrevを刻む
  try {
    response.headers.set("x-boundary-rev", BOUNDARY_REV);
  } catch {}

  const ct = response.headers.get("content-type") || "";
  if (ct.includes("text/html")) {
    try {
      response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      response.headers.set("CDN-Cache-Control", "no-store");
    } catch {}
  }

  // 運営系レスポンスは検索エンジンから常に除外する
  if (normalizedPath.startsWith("/ops-login") || normalizedPath.startsWith("/_emdash")) {
    try {
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    } catch {}
  }

  // ⓪b 未認証で読める記事 API 応答からも内部専用サイトの記事を落とす
  //    （/divisions/motor-paper を塞いでも、posts API の title/excerpt 経由で抜けないようにする）
  const isPostsApi =
    (normalizedPath === "/_emdash/api/content/posts" || normalizedPath === "/api/content/posts") &&
    method === "GET";
  if (isPostsApi) {
    // 運営者トークンを持っている場合（HUD・運営ツールからの取得）は全サイトの記事を見せる。
    // トークンなしの公開リクエストだけ内部専用サイトの記事を落とす。
    const env = await resolveRuntimeEnv(context);
    const expectedHash = await resolveExpectedHash(env);
    let isOperator = false;
    for (const token of readCandidateTokens(context.request, url.searchParams)) {
      const hash = await sha256Hex(token);
      if (constantTimeEquals(hash, expectedHash)) {
        isOperator = true;
        break;
      }
    }
    if (!isOperator) {
      try {
        const bodyText = await response.text();
        const parsed = JSON.parse(bodyText);
        const container = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
        const key = Array.isArray(container?.items)
          ? "items"
          : Array.isArray(container?.posts)
          ? "posts"
          : Array.isArray(container?.results)
          ? "results"
          : "";
        if (key) {
          const original: any[] = container[key];
          const kept = original.filter((it: any) => isPublicArticle(it));
          if (kept.length !== original.length) {
            container[key] = kept;
            if (typeof container.total === "number") {
              container.total = Math.max(0, container.total - (original.length - kept.length));
            }
            const headers = new Headers(response.headers);
            headers.delete("content-length");
            return new Response(JSON.stringify(parsed), { status: response.status, headers });
          }
        }
      } catch {}
    }
  }

  if (needsClearCookie) {
    try {
      response.headers.append("Set-Cookie", "emdash_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    } catch {}
  }

  return response;
});
