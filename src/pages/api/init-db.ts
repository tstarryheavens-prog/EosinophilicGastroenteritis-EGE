export const prerender = false;
import { env } from "cloudflare:workers";
import initStatements from "../../data/emdash_init_statements.json";
import { OPS_TOKEN_ENV_KEYS, OPS_TOKEN_HASH_ENV_KEYS, OPS_TOKEN_SHA256 } from "../../data/ops_config";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 期待ハッシュ（平文トークンは保持しない。環境変数に平文があればその場でハッシュ化） */
async function resolveExpectedHash(): Promise<string> {
  const candidates: Record<string, string>[] = [];
  try {
    const mod: any = await import("cloudflare:workers" as any);
    if (mod?.env) candidates.push(mod.env);
  } catch {}
  try {
    const proc = (globalThis as any).process?.env;
    if (proc) candidates.push(proc);
  } catch {}
  for (const key of OPS_TOKEN_HASH_ENV_KEYS) {
    for (const c of candidates) {
      const v = c?.[key];
      if (typeof v === "string" && v.trim()) return v.trim().toLowerCase();
    }
  }
  for (const key of OPS_TOKEN_ENV_KEYS) {
    for (const c of candidates) {
      const v = c?.[key];
      if (typeof v === "string" && v.trim()) return await sha256Hex(v.trim());
    }
  }
  return OPS_TOKEN_SHA256.toLowerCase();
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** 運営者トークンの提示（Authorization ヘッダー優先。URL にトークンを載せる運用は避ける） */
async function opsAuthorized(request: Request, query: URLSearchParams): Promise<boolean> {
  const cands: string[] = [];
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) cands.push(auth.slice(7).trim());
  const hdr = request.headers.get("x-ops-token");
  if (hdr) cands.push(hdr.trim());
  for (const part of (request.headers.get("cookie") || "").split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if ((name === "sla_ops" || name === "ops_token") && value) cands.push(value);
  }
  const q = query.get("ops_token");
  if (q) cands.push(q);
  const expected = await resolveExpectedHash();
  for (const token of cands.filter(Boolean)) {
    if (constantTimeEquals(await sha256Hex(token), expected)) return true;
  }
  return false;
}

export async function GET(context: any) {
  return handleInit(context);
}

export async function POST(context: any) {
  return handleInit(context);
}

async function handleInit(context: any) {
  try {
    const url = context.url ? new URL(context.url.toString()) : new URL(context.request.url);
    // 平文の共通 key は廃止（公開リポジトリに秘密を置かない・エラー文にも出さない）。
    // middleware が未認証要求を 404 で隠すが、ここでは二重防御として運営者トークンのハッシュ照合を行う。
    if (!(await opsAuthorized(context.request, url.searchParams))) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized: 運営者トークンが必要です（Authorization: Bearer <ops_token>）",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const cfEnv = env as any;
    if (!cfEnv.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "D1 database binding 'DB' is missing in environment",
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const db = cfEnv.DB;
    let body: any = {};
    if (context.request.method === "POST") {
      body = await context.request.json().catch(() => ({}));
    }

    // Direct fix for missing fields and admin user
    const fix = url.searchParams.get("fix");
    if (fix === "fields") {
      const fixLog: string[] = [];
      const fieldStmts = [
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_posts_title', 'col_posts', 'title', 'タイトル', 'string', 'TEXT', 1, 0, NULL, NULL, 'text', NULL, 1, datetime('now'), 1, 1, 0)`,
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_posts_content', 'col_posts', 'content', '本文', 'portableText', 'TEXT', 0, 0, NULL, NULL, 'richtext', NULL, 2, datetime('now'), 1, 1, 0)`,
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_posts_excerpt', 'col_posts', 'excerpt', '要約', 'text', 'TEXT', 0, 0, NULL, NULL, 'textarea', NULL, 3, datetime('now'), 0, 1, 0)`,
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_posts_featured_image', 'col_posts', 'featured_image', 'アイキャッチ画像', 'image', 'TEXT', 0, 0, NULL, NULL, 'image', NULL, 4, datetime('now'), 0, 1, 0)`,
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_pages_title', 'col_pages', 'title', 'タイトル', 'string', 'TEXT', 1, 0, NULL, NULL, 'text', NULL, 1, datetime('now'), 1, 1, 0)`,
        `INSERT OR REPLACE INTO "_emdash_fields" ("id", "collection_id", "slug", "label", "type", "column_type", "required", "unique", "default_value", "validation", "widget", "options", "sort_order", "created_at", "searchable", "translatable", "indexed") VALUES ('fld_pages_content', 'col_pages', 'content', '本文', 'portableText', 'TEXT', 0, 0, NULL, NULL, 'richtext', NULL, 2, datetime('now'), 1, 1, 0)`,
        `INSERT OR REPLACE INTO "users" ("id", "email", "name", "avatar_url", "role", "email_verified", "disabled", "created_at", "updated_at") VALUES ('usr_admin_potoru', 'T.starryheavens@gmail.com', 'ぽトル', 'https://cdn-ak.f.st-hatena.com/images/fotolife/M/MyToyotaHomeBottle/20261003/20261003213941.jpg', 50, 1, 0, datetime('now'), datetime('now'))`
      ];

      for (const sql of fieldStmts) {
        try {
          await db.prepare(sql).run();
          fixLog.push("OK: " + sql.slice(0, 50));
        } catch (err: any) {
          fixLog.push("ERR: " + err.message + " in " + sql.slice(0, 50));
        }
      }

      const { results: fields } = await db.prepare("SELECT * FROM _emdash_fields").all();
      const { results: users } = await db.prepare("SELECT * FROM users").all();

      return new Response(JSON.stringify({ success: true, fixLog, fieldCount: fields?.length, userCount: users?.length, fields, users }), {
        headers: { "content-type": "application/json" },
      });
    }

    const query = body.query || url.searchParams.get("query");
    if (query) {
      try {
        const { results } = await db.prepare(query).all();
        return new Response(JSON.stringify({ success: true, query, results }), {
          headers: { "content-type": "application/json" },
        });
      } catch (qErr: any) {
        return new Response(JSON.stringify({ success: false, query, error: qErr.message }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
    }

    const exec = body.exec || url.searchParams.get("exec");
    if (exec) {
      try {
        const result = await db.prepare(exec).run();
        return new Response(JSON.stringify({ success: true, exec, result }), {
          headers: { "content-type": "application/json" },
        });
      } catch (eErr: any) {
        return new Response(JSON.stringify({ success: false, exec, error: eErr.message }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
    }

    const statements: string[] = initStatements as string[];
    const totalStatements = statements.length;
    let executedCount = 0;
    const errors: Array<{ index: number; stmt: string; error: string }> = [];

    // Execute in batches of 20 statements to respect D1 limits
    const BATCH_SIZE = 20;
    for (let i = 0; i < statements.length; i += BATCH_SIZE) {
      const chunk = statements.slice(i, i + BATCH_SIZE);
      const preparedBatch = chunk.map((sql) => db.prepare(sql));
      
      try {
        await db.batch(preparedBatch);
        executedCount += chunk.length;
      } catch (batchErr: any) {
        // Fallback to single statement execution to isolate the exact error
        for (let j = 0; j < chunk.length; j++) {
          const singleSql = chunk[j];
          try {
            await db.prepare(singleSql).run();
            executedCount++;
          } catch (singleErr: any) {
            errors.push({
              index: i + j,
              stmt: singleSql.slice(0, 100) + "...",
              error: singleErr.message || String(singleErr),
            });
          }
        }
      }
    }

    // Verify results
    const { results: tableResults } = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all();
    
    let postCount = 0;
    try {
      const { results: countResults } = await db
        .prepare("SELECT COUNT(*) as count FROM ec_posts")
        .all();
      postCount = countResults[0]?.count ?? 0;
    } catch (e) {
      // ec_posts might have failed if an error occurred
    }

    let migrationCount = 0;
    try {
      const { results: migResults } = await db
        .prepare("SELECT COUNT(*) as count FROM _emdash_migrations")
        .all();
      migrationCount = migResults[0]?.count ?? 0;
    } catch (e) {
      // ignore
    }

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        totalStatements,
        executedCount,
        errorCount: errors.length,
        errors: errors.slice(0, 10), // return top 10 errors if any
        tableCount: tableResults?.length ?? 0,
        tables: tableResults?.map((t: any) => t.name) ?? [],
        postCount,
        migrationCount,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || String(err),
        stack: err.stack,
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
