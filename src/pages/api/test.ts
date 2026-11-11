export const prerender = false;
import { env } from "cloudflare:workers";

export async function GET(context: any) {
  try {
    const cfEnv = env as any;
    const hasDB = !!cfEnv.DB;
    const hasMEDIA = !!cfEnv.MEDIA;

    let tablesCount = 0;
    let migrationsCount = 0;
    let latestMigration = null;
    let dbError = null;
    let samplePost = null;
    let pragmaColumns = null;

    if (hasDB) {
      try {
        const pCols: any = await cfEnv.DB.prepare("PRAGMA table_info(ec_posts)").all();
        pragmaColumns = pCols?.results ?? null;

        const sp: any = await cfEnv.DB.prepare("SELECT * FROM ec_posts LIMIT 2").all();
        samplePost = sp?.results ?? null;
      } catch (e: any) {
        dbError = e.message || String(e);
      }
    }

    if (hasDB) {
      try {
        const t: any = await cfEnv.DB.prepare(
          "SELECT count(*) as count FROM sqlite_master WHERE type='table'"
        ).first();
        tablesCount = t?.count ?? 0;

        const m: any = await cfEnv.DB.prepare(
          "SELECT name, timestamp FROM _emdash_migrations ORDER BY name DESC LIMIT 1"
        ).first();
        latestMigration = m ?? null;

        const mc: any = await cfEnv.DB.prepare(
          "SELECT count(*) as count FROM _emdash_migrations"
        ).first();
        migrationsCount = mc?.count ?? 0;
      } catch (e: any) {
        dbError = e.message || String(e);
      }
    }

    const localsKeys = Object.keys(context.locals || {});
    const emdashKeys = Object.keys((context.locals as any)?.emdash || {});
    const emdashInfo = (context.locals as any)?.emdash
      ? {
          hasDb: !!(context.locals as any).emdash.db,
          hasConfig: !!(context.locals as any).emdash.config,
          keys: emdashKeys,
        }
      : null;

    return new Response(
      JSON.stringify({
        success: true,
        commitSha: cfEnv.CF_PAGES_COMMIT_SHA,
        tablesCount,
        migrationsCount,
        latestMigration,
        pragmaColumns,
        samplePost,
        dbError,
        localsKeys,
        middlewareRan: !!(context.locals as any)?.middlewareRan,
        hasEmdash: !!(context.locals as any)?.emdash,
        emdashInfo,
        hasUser: !!(context.locals as any)?.user,
        user: (context.locals as any)?.user ?? null,
      }),
      {
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || String(err),
        stack: err?.stack,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  }
}
