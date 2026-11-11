export const prerender = false;
import { env } from "cloudflare:workers";
import { ARTICLES } from "../data/articles";
import { EMDASH_ADMIN_SHELL_HTML } from "../data/emdash_admin_shell";

export async function ALL(context: any) {
  const url = new URL(context.request.url);
  const rawPath = url.pathname;
  const path = rawPath.replace(/\/+$/, "") || "/";
  const method = context.request.method.toUpperCase();

  // 管理者ユーザー情報
  const adminUser = {
    id: "usr_admin_01",
    email: "T.starryheavens@gmail.com",
    name: "ぽトル",
    role: 50,
    avatarUrl: "https://cdn-ak.f.st-hatena.com/images/fotolife/M/MyToyotaHomeBottle/20261003/20261003213941.jpg",
    isFirstLogin: false,
    email_verified: 1,
    disabled: 0,
  };

  const getDb = () => {
    try {
      const cfEnv = env as any;
      if (cfEnv?.DB) return cfEnv.DB;
    } catch {}
    try {
      const localEnv = (context.locals as any)?.runtime?.env;
      if (localEnv?.DB) return localEnv.DB;
    } catch {}
    return null;
  };

  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "private, no-store",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, PATCH, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
        "x-handled-by": "smartailife-catchall-api",
      },
    });
  };

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, PATCH, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
      },
    });
  }

  // =========================================================================
  // 1. EmDash API ハンドリング
  // =========================================================================
  if (path.startsWith("/_emdash/api")) {
    // 1-A. /_emdash/api/auth/me
    if (path === "/_emdash/api/auth/me") {
      return jsonResponse({ success: true, data: adminUser });
    }

    // 1-B. /_emdash/api/manifest
    if (path === "/_emdash/api/manifest") {
      const manifestData = {
        version: "1.3.1",
        commit: "12a179389",
        hash: "default",
        collections: {
          posts: {
            id: "col_posts",
            slug: "posts",
            label: "記事",
            labelSingular: "記事",
            description: "Smart AI Life 記事コレクション",
            icon: "article",
            supports: ["revisions", "drafts", "search"],
            source: "template:blog",
            hidden: false,
            routable: true,
            hasSeo: true,
            urlPattern: "/articles/{slug}",
            titleField: "title",
            listColumns: ["title", "site_id", "featured_image"],
            fields: {
              title: {
                id: "fld_posts_title",
                slug: "title",
                label: "タイトル",
                type: "string",
                kind: "string",
                required: true,
                sortOrder: 1,
                searchable: true,
                translatable: true,
              },
              site_id: {
                id: "fld_posts_site_id",
                slug: "site_id",
                label: "ラボ (site_id)",
                type: "string",
                kind: "string",
                required: false,
                sortOrder: 2,
                searchable: true,
                translatable: false,
              },
              excerpt: {
                id: "fld_posts_excerpt",
                slug: "excerpt",
                label: "要約",
                type: "text",
                kind: "richText",
                required: false,
                sortOrder: 3,
                searchable: false,
                translatable: true,
              },
              content: {
                id: "fld_posts_content",
                slug: "content",
                label: "本文 (HTML / Markdown)",
                type: "text",
                kind: "richText",
                required: false,
                sortOrder: 4,
                searchable: true,
                translatable: true,
              },
              featured_image: {
                id: "fld_posts_featured_image",
                slug: "featured_image",
                label: "アイキャッチ画像",
                type: "image",
                kind: "image",
                required: false,
                sortOrder: 5,
                searchable: false,
                translatable: false,
              },
            },
          },
          pages: {
            id: "col_pages",
            slug: "pages",
            label: "固定ページ",
            labelSingular: "固定ページ",
            description: "Smart AI Life 固定ページ",
            icon: "file-text",
            supports: ["revisions", "drafts", "search"],
            source: "template:blog",
            hidden: false,
            routable: true,
            hasSeo: true,
            urlPattern: "/articles/{slug}",
            titleField: "title",
            listColumns: ["title"],
            fields: {
              title: {
                id: "fld_pages_title",
                slug: "title",
                label: "タイトル",
                type: "string",
                kind: "string",
                required: true,
                widget: "text",
                sortOrder: 1,
                searchable: true,
                translatable: true,
              },
              content: {
                id: "fld_pages_content",
                slug: "content",
                label: "本文",
                type: "portableText",
                kind: "portableText",
                required: false,
                widget: "richtext",
                sortOrder: 2,
                searchable: true,
                translatable: true,
              },
            },
          },
        },
        plugins: {},
        timezone: "Asia/Tokyo",
        taxonomies: [],
        authMode: "passkey",
        providerManagedName: false,
        signupEnabled: false,
        siteTitle: "Smart AI Life",
        siteUrl: "https://ai-living-lab.pages.dev",
        defaultLocale: "ja",
        locales: ["ja"],
      };
      return jsonResponse({ success: true, data: manifestData });
    }

    // 1-B2. /_emdash/api/calendar
    if (path === "/_emdash/api/calendar" || path.startsWith("/_emdash/api/calendar")) {
      const calendarItems = ARTICLES.map((art) => {
        const dateIso = art.date ? new Date(`${art.date}T12:00:00+09:00`).toISOString() : new Date().toISOString();
        return {
          id: `post_${art.slug}`,
          contentId: `post_${art.slug}`,
          collection: "posts",
          kind: "published",
          status: "published",
          at: dateIso,
          title: art.title,
          locale: "ja",
          slug: art.slug,
        };
      });
      return jsonResponse({
        success: true,
        data: {
          items: calendarItems,
          nextCursor: null,
          truncated: false,
        },
      });
    }

    // 1-B3. /_emdash/api/relations & /_emdash/api/schema/*
    if (path === "/_emdash/api/relations" || path.startsWith("/_emdash/api/relations")) {
      return jsonResponse({ success: true, data: { relations: [] } });
    }
    if (path === "/_emdash/api/schema/orphans") {
      return jsonResponse({ success: true, data: { items: [] } });
    }
    if (path === "/_emdash/api/schema/block-types") {
      return jsonResponse({ success: true, data: { items: [] } });
    }
    if (path.startsWith("/_emdash/api/schema/collections")) {
      const collectionsList = [
        {
          id: "col_posts",
          slug: "posts",
          label: "記事",
          labelSingular: "記事",
          description: "Smart AI Life 記事コレクション",
          icon: "article",
          supports: ["revisions", "drafts", "search"],
          source: "code",
          hidden: false,
          routable: true,
          hasSeo: true,
          urlPattern: "/articles/{slug}",
          titleField: "title",
          listColumns: ["title", "featured_image"],
        },
        {
          id: "col_pages",
          slug: "pages",
          label: "固定ページ",
          labelSingular: "固定ページ",
          description: "Smart AI Life 固定ページ",
          icon: "file-text",
          supports: ["revisions", "drafts", "search"],
          source: "code",
          hidden: false,
          routable: true,
          hasSeo: true,
          urlPattern: "/articles/{slug}",
          titleField: "title",
          listColumns: ["title"],
        },
      ];

      if (path.includes("/fields")) {
        return jsonResponse({ success: true, data: { items: [] } });
      }
      if (path === "/_emdash/api/schema/collections/posts") {
        return jsonResponse({ success: true, data: { item: collectionsList[0] } });
      }
      if (path === "/_emdash/api/schema/collections/pages") {
        return jsonResponse({ success: true, data: { item: collectionsList[1] } });
      }
      return jsonResponse({ success: true, data: { items: collectionsList } });
    }

    // 1-C. /_emdash/api/dashboard
    if (path === "/_emdash/api/dashboard") {
      let postsCount = 12;
      let recentPosts: any[] = [];
      const db = getDb();

      if (db) {
        try {
          const countRes: any = await db.prepare("SELECT count(*) as count FROM ec_posts").first();
          if (countRes?.count !== undefined) postsCount = countRes.count;

          const postsRes: any = await db.prepare(
            "SELECT id, title, slug, status, updated_at FROM ec_posts ORDER BY updated_at DESC LIMIT 10"
          ).all();
          if (postsRes?.results) {
            recentPosts = postsRes.results.map((p: any) => ({
              id: p.id,
              collection: "posts",
              collectionLabel: "記事",
              title: p.title || "無題",
              slug: p.slug || "",
              status: p.status || "published",
              updatedAt: p.updated_at || new Date().toISOString(),
              authorId: "usr_admin_01",
            }));
          }
        } catch {}
      }

      return jsonResponse({
        success: true,
        data: {
          collections: [
            { slug: "posts", label: "記事", count: postsCount, total: postsCount },
            { slug: "pages", label: "固定ページ", count: 0, total: 0 },
          ],
          mediaCount: 0,
          userCount: 1,
          recentItems: recentPosts,
          schedulerHealth: { status: "healthy", lastCompletedAt: new Date().toISOString() },
        },
      });
    }

    // 1-D. /_emdash/api/content/posts/authors
    if (path === "/_emdash/api/content/posts/authors") {
      return jsonResponse({ success: true, data: { items: [adminUser] } });
    }

    // 1-E. /_emdash/api/content/posts/trash
    if (path === "/_emdash/api/content/posts/trash") {
      return jsonResponse({ success: true, data: { items: [], total: 0, page: 1, limit: 20 } });
    }

    // 1-F. /_emdash/api/content/posts (一覧 & 新規作成)
    if (path === "/_emdash/api/content/posts") {
      const db = getDb();
      const reqUrl = new URL(context.request.url);
      const querySiteId = reqUrl.searchParams.get("site_id");

      // POST: 新規記事作成
      if (method === "POST") {
        const body = await context.request.json().catch(() => ({}));
        const siteId = body.site_id || body.data?.site_id || "smartailife";
        const slug = body.slug || body.data?.slug || "post-" + Date.now();
        const title = body.title || body.data?.title || "無題";
        const content = body.content || body.data?.content || "";
        const excerpt = body.excerpt || body.data?.excerpt || "";
        const status = body.status || "published";
        const postId = body.id || "post_" + slug;
        const now = new Date().toISOString();

        if (db) {
          try {
            await db.prepare("ALTER TABLE ec_posts ADD COLUMN site_id TEXT DEFAULT 'smartailife'").run().catch(() => {});
          } catch {}

          try {
            await db.prepare(`
              INSERT OR REPLACE INTO ec_posts (
                id, slug, status, author_id, created_at, updated_at, published_at, locale, title, content, excerpt, site_id
              ) VALUES (?, ?, ?, 'usr_admin_01', ?, ?, ?, 'ja', ?, ?, ?, ?)
            `).bind(
              postId,
              slug,
              status,
              now,
              now,
              now,
              title,
              typeof content === "string" ? content : JSON.stringify(content),
              excerpt,
              siteId
            ).run();
          } catch (e: any) {
            try {
              await db.prepare(`
                INSERT OR REPLACE INTO ec_posts (
                  id, slug, status, author_id, created_at, updated_at, published_at, locale, title, content, excerpt
                ) VALUES (?, ?, ?, 'usr_admin_01', ?, ?, ?, 'ja', ?, ?, ?)
              `).bind(
                postId,
                slug,
                status,
                now,
                now,
                now,
                title,
                typeof content === "string" ? content : JSON.stringify(content),
                excerpt
              ).run();
            } catch (err: any) {
              console.error("Failed to insert post into ec_posts:", err);
            }
          }
        }

        const revId = "rev_" + postId + "_" + Date.now();
        return jsonResponse({
          success: true,
          data: {
            item: {
              id: postId,
              slug,
              status,
              title,
              content,
              excerpt,
              site_id: siteId,
              siteId,
              authorId: "usr_admin_01",
              createdAt: now,
              updatedAt: now,
              publishedAt: now,
              liveRevisionId: revId,
              draftRevisionId: revId,
              data: {
                title,
                content,
                excerpt,
                site_id: siteId,
                siteId,
                featured_image: body.featured_image || body.data?.featured_image || null,
              },
            },
            _rev: revId,
          },
        }, 201);
      }

      let items: any[] = [];
      let total = 0;

      if (db) {
        try {
          let countQuery = "SELECT count(*) as count FROM ec_posts";
          let postsQuery = "SELECT id, slug, status, author_id, created_at, updated_at, published_at, locale, title, content, excerpt, site_id FROM ec_posts";
          const queryParams: any[] = [];

          if (querySiteId) {
            countQuery += " WHERE site_id = ?";
            postsQuery += " WHERE site_id = ?";
            queryParams.push(querySiteId);
          }

          postsQuery += " ORDER BY published_at DESC LIMIT 200";

          try {
            const countStmt = queryParams.length > 0 ? db.prepare(countQuery).bind(...queryParams) : db.prepare(countQuery);
            const countRes: any = await countStmt.first();
            total = countRes?.count ?? 0;

            const postsStmt = queryParams.length > 0 ? db.prepare(postsQuery).bind(...queryParams) : db.prepare(postsQuery);
            const postsRes: any = await postsStmt.all();

            if (postsRes?.results) {
              items = postsRes.results.map((p: any) => ({
                id: p.id,
                slug: p.slug,
                status: p.status || "published",
                title: p.title || "無題",
                excerpt: p.excerpt || "",
                site_id: p.site_id || "smartailife",
                siteId: p.site_id || "smartailife",
                publishedAt: p.published_at || p.created_at,
                updatedAt: p.updated_at || p.created_at,
                createdAt: p.created_at,
                locale: p.locale || "ja",
                author: { id: "usr_admin_01", name: "ぽトル" },
                authorId: "usr_admin_01",
                data: {
                  title: p.title || "無題",
                  content: p.content || "",
                  excerpt: p.excerpt || "",
                  site_id: p.site_id || "smartailife",
                  siteId: p.site_id || "smartailife",
                  featured_image: p.featured_image || null,
                },
              }));
            }
          } catch {
            const countRes: any = await db.prepare("SELECT count(*) as count FROM ec_posts").first();
            total = countRes?.count ?? 0;

            const postsRes: any = await db.prepare(
              "SELECT id, slug, status, author_id, created_at, updated_at, published_at, locale, title, content, excerpt FROM ec_posts ORDER BY published_at DESC LIMIT 200"
            ).all();

            if (postsRes?.results) {
              items = postsRes.results.map((p: any) => ({
                id: p.id,
                slug: p.slug,
                status: p.status || "published",
                title: p.title || "無題",
                excerpt: p.excerpt || "",
                site_id: "smartailife",
                siteId: "smartailife",
                publishedAt: p.published_at || p.created_at,
                updatedAt: p.updated_at || p.created_at,
                createdAt: p.created_at,
                locale: p.locale || "ja",
                author: { id: "usr_admin_01", name: "ぽトル" },
                authorId: "usr_admin_01",
                data: {
                  title: p.title || "無題",
                  content: p.content || "",
                  excerpt: p.excerpt || "",
                  site_id: "smartailife",
                  siteId: "smartailife",
                  featured_image: p.featured_image || null,
                },
              }));
            }
          }
        } catch {}
      }

      return jsonResponse({
        success: true,
        data: { items, total, page: 1, limit: 50 },
      });
    }

    // 1-G. /_emdash/api/content/posts/:id (個別記事取得・更新)
    if (path.startsWith("/_emdash/api/content/posts/")) {
      const subPath = path.slice("/_emdash/api/content/posts/".length);
      const [postId, action] = subPath.split("/");
      const cleanSlug = postId.replace(/^post_/, "");

      if (action === "translations") {
        return jsonResponse({ success: true, data: [] });
      }

      const db = getDb();

      // GET: 記事取得
      if (method === "GET") {
        if (db) {
          try {
            const post: any = await db.prepare(
              "SELECT * FROM ec_posts WHERE id = ? OR slug = ? OR slug = ? OR id = ?"
            ).bind(postId, postId, cleanSlug, `post_${cleanSlug}`).first();

            if (post) {
              const title = post.title || "無題";
              const content = post.content || "";
              const excerpt = post.excerpt || "";
              const siteId = post.site_id || "smartailife";
              const revId = "rev_" + post.id;
              return jsonResponse({
                success: true,
                data: {
                  item: {
                    id: post.id,
                    slug: post.slug,
                    status: post.status || "published",
                    title,
                    content,
                    excerpt,
                    site_id: siteId,
                    siteId,
                    locale: post.locale || "ja",
                    authorId: post.author_id || "usr_admin_01",
                    author: { id: "usr_admin_01", name: "ぽトル" },
                    createdAt: post.created_at || new Date().toISOString(),
                    updatedAt: post.updated_at || new Date().toISOString(),
                    publishedAt: post.published_at || post.created_at || new Date().toISOString(),
                    liveRevisionId: revId,
                    draftRevisionId: revId,
                    data: {
                      title,
                      content,
                      excerpt,
                      site_id: siteId,
                      siteId,
                      featured_image: post.featured_image || null,
                    },
                  },
                  _rev: revId,
                },
              });
            }
          } catch {}
        }

        // ARTICLES フォールバック
        const matched = ARTICLES.find((a: any) => a.slug === postId || a.slug === cleanSlug);
        if (matched) {
          const revId = "rev_" + postId;
          return jsonResponse({
            success: true,
            data: {
              item: {
                id: postId,
                slug: matched.slug,
                status: "published",
                title: matched.title,
                content: matched.content || "",
                excerpt: matched.excerpt || "",
                locale: "ja",
                authorId: "usr_admin_01",
                author: { id: "usr_admin_01", name: "ぽトル" },
                createdAt: matched.date ? `${matched.date}T00:00:00Z` : new Date().toISOString(),
                updatedAt: matched.date ? `${matched.date}T00:00:00Z` : new Date().toISOString(),
                publishedAt: matched.date ? `${matched.date}T00:00:00Z` : new Date().toISOString(),
                liveRevisionId: revId,
                draftRevisionId: revId,
                data: {
                  title: matched.title,
                  content: matched.content || "",
                  excerpt: matched.excerpt || "",
                  featured_image: matched.heroImage || null,
                },
              },
              _rev: revId,
            },
          });
        }

        return jsonResponse({ success: false, error: { message: "Post not found" } }, 404);
      }

      // PUT / POST / PATCH: 記事保存
      if (method === "PUT" || method === "POST" || method === "PATCH") {
        const body = await context.request.json().catch(() => ({}));
        const inputTitle = body.title || body.data?.title || null;
        const inputContent = body.content || body.data?.content || null;
        const inputExcerpt = body.excerpt || body.data?.excerpt || null;
        const inputSiteId = body.site_id || body.data?.site_id || null;
        const status = body.status || "published";
        const revId = "rev_" + postId + "_" + Date.now();

        let updatedPost: any = null;

        if (db) {
          try {
            await db.prepare("ALTER TABLE ec_posts ADD COLUMN site_id TEXT DEFAULT 'smartailife'").run().catch(() => {});
          } catch {}

          try {
            await db.prepare(`
              UPDATE ec_posts 
              SET title = COALESCE(?, title),
                  slug = COALESCE(?, slug),
                  content = COALESCE(?, content),
                  excerpt = COALESCE(?, excerpt),
                  status = COALESCE(?, status),
                  site_id = COALESCE(?, site_id),
                  updated_at = datetime('now')
              WHERE id = ? OR slug = ? OR slug = ?
            `).bind(
              inputTitle,
              body.slug ?? null,
              inputContent ? (typeof inputContent === "string" ? inputContent : JSON.stringify(inputContent)) : null,
              inputExcerpt,
              status,
              inputSiteId,
              postId,
              postId,
              cleanSlug
            ).run();

            updatedPost = await db.prepare(
              "SELECT * FROM ec_posts WHERE id = ? OR slug = ? OR slug = ?"
            ).bind(postId, postId, cleanSlug).first();
          } catch {
            try {
              await db.prepare(`
                UPDATE ec_posts 
                SET title = COALESCE(?, title),
                    slug = COALESCE(?, slug),
                    content = COALESCE(?, content),
                    excerpt = COALESCE(?, excerpt),
                    status = COALESCE(?, status),
                    updated_at = datetime('now')
                WHERE id = ? OR slug = ? OR slug = ?
              `).bind(
                inputTitle,
                body.slug ?? null,
                inputContent ? (typeof inputContent === "string" ? inputContent : JSON.stringify(inputContent)) : null,
                inputExcerpt,
                status,
                postId,
                postId,
                cleanSlug
              ).run();

              updatedPost = await db.prepare(
                "SELECT * FROM ec_posts WHERE id = ? OR slug = ? OR slug = ?"
              ).bind(postId, postId, cleanSlug).first();
            } catch {}
          }
        }

        const title = updatedPost?.title || inputTitle || "無題";
        const content = updatedPost?.content || inputContent || "";
        const excerpt = updatedPost?.excerpt || inputExcerpt || "";
        const siteId = updatedPost?.site_id || inputSiteId || "smartailife";

        return jsonResponse({
          success: true,
          data: {
            item: {
              id: postId,
              slug: body.slug || cleanSlug,
              status,
              title,
              content,
              excerpt,
              site_id: siteId,
              siteId,
              authorId: "usr_admin_01",
              updatedAt: new Date().toISOString(),
              liveRevisionId: revId,
              draftRevisionId: revId,
              data: {
                title,
                content,
                excerpt,
                site_id: siteId,
                siteId,
                featured_image: body.featured_image || body.data?.featured_image || null,
              },
            },
            _rev: revId,
          },
        });
      }
    }

    // 1-H. コメント関連 API
    if (path === "/_emdash/api/admin/comments/counts" || path === "/_emdash/api/comments/counts") {
      return jsonResponse({
        success: true,
        data: { pending: 0, approved: 0, spam: 0, trash: 0, total: 0 },
      });
    }
    if (path === "/_emdash/api/admin/comments" || path === "/_emdash/api/comments") {
      return jsonResponse({
        success: true,
        data: { items: [], total: 0, page: 1, limit: 50 },
      });
    }

    // 1-I. アップデートチェック
    if (path === "/_emdash/api/admin/core-update") {
      return jsonResponse({
        success: true,
        data: { hasUpdate: false, currentVersion: "1.3.1", latestVersion: "1.3.1" },
      });
    }

    // 1-J. 署名 (Bylines) / スキーマ
    if (path.startsWith("/_emdash/api/admin/bylines") || path.startsWith("/_emdash/api/bylines")) {
      const defaultByline = {
        id: "byline_pottle",
        displayName: "ぽトル",
        slug: "pottle",
        bio: "省エネ脱力パンダ。自作HEMSとAI自動化で生活をアップグレード中。",
        website: "https://ai-living-lab.pages.dev",
        avatarUrl: "https://cdn-ak.f.st-hatena.com/images/fotolife/M/MyToyotaHomeBottle/20261003/20261003213941.jpg",
        avatarMediaId: null,
        isGuest: false,
        userId: "usr_admin_01",
        locale: "ja",
        createdAt: "2026-10-03T00:00:00Z",
        updatedAt: "2026-10-20T00:00:00Z",
      };
      return jsonResponse({
        success: true,
        data: { items: [defaultByline], total: 1, nextCursor: null },
      });
    }
    if (path.startsWith("/_emdash/api/byline-schema")) {
      return jsonResponse({ success: true, data: { fields: [] } });
    }

    // 1-K. 固定ページ一覧 (pages)
    if (path === "/_emdash/api/content/pages") {
      return jsonResponse({ success: true, data: { items: [], total: 0, page: 1, limit: 50 } });
    }
    if (path === "/_emdash/api/content/pages/authors") {
      return jsonResponse({ success: true, data: { items: [adminUser] } });
    }
    if (path === "/_emdash/api/content/pages/trash") {
      return jsonResponse({ success: true, data: { items: [], total: 0, page: 1, limit: 20 } });
    }

    // 1-L. メニュー (Menus)
    if (path.startsWith("/_emdash/api/menus") || path.startsWith("/_emdash/api/admin/menus")) {
      const defaultMenu = {
        id: "menu_primary",
        name: "primary",
        label: "メインメニュー",
        locale: "ja",
        items: [
          { id: "item_1", label: "ホーム", url: "/" },
          { id: "item_2", label: "記事一覧", url: "/articles/" },
          { id: "item_3", label: "MCPショウケース", url: "/mcp-showcase/" },
        ],
        itemsCount: 3,
        createdAt: "2026-10-01T00:00:00Z",
        updatedAt: "2026-10-20T00:00:00Z",
      };
      return jsonResponse({ success: true, data: [defaultMenu] });
    }

    // 1-M. メディア (Media)
    if (path.startsWith("/_emdash/api/media/folders")) {
      return jsonResponse({ success: true, data: { items: [], nextCursor: null, total: 0 } });
    }
    if (path.startsWith("/_emdash/api/media") || path.startsWith("/_emdash/api/admin/media")) {
      const defaultMedia = {
        id: "media_pottle_avatar",
        filename: "20261003213941.jpg",
        url: "https://cdn-ak.f.st-hatena.com/images/fotolife/M/MyToyotaHomeBottle/20261003/20261003213941.jpg",
        mimeType: "image/jpeg",
        fileSize: 18450,
        width: 300,
        height: 300,
        alt: "ぽトル 公式アバター",
        caption: "ぽトル（Pottle）",
        folderId: null,
        authorId: "usr_admin_01",
        createdAt: "2026-10-03T21:39:41Z",
        updatedAt: "2026-10-20T00:00:00Z",
      };
      return jsonResponse({
        success: true,
        data: {
          items: [defaultMedia],
          total: 1,
          totalCount: 1,
          page: 1,
          limit: 35,
          nextCursor: null,
        },
      });
    }

    // 1-N. ユーザー一覧 (Users)
    if (path.startsWith("/_emdash/api/users") || path.startsWith("/_emdash/api/admin/users")) {
      return jsonResponse({
        success: true,
        data: { items: [adminUser], total: 1, nextCursor: null },
      });
    }

    // 1-O. プラグイン (Plugins)
    if (path.startsWith("/_emdash/api/plugins") || path.startsWith("/_emdash/api/admin/plugins")) {
      return jsonResponse({
        success: true,
        data: { items: [] },
      });
    }

    // 1-P. タクソノミー / リダイレクト / 設定
    if (path === "/_emdash/api/taxonomies") {
      return jsonResponse({ success: true, data: { items: [], total: 0 } });
    }
    if (path === "/_emdash/api/redirects") return jsonResponse({ success: true, data: { items: [], total: 0 } });
    if (path === "/_emdash/api/settings") {
      return jsonResponse({
        success: true,
        data: { siteTitle: "Smart AI Life", siteUrl: "https://ai-living-lab.pages.dev", defaultLocale: "ja" },
      });
    }

    // 1-Q. その他の EmDash API 汎用フォールバック
    return jsonResponse({ success: true, data: {} });
  }

  // =========================================================================
  // 2. EmDash 管理画面 SPA ルーティング (/_emdash/admin/*)
  // =========================================================================
  if (path.startsWith("/_emdash/admin")) {
    const res = new Response(EMDASH_ADMIN_SHELL_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store",
        "x-handled-by": "smartailife-admin-spa",
      },
    });
    res.headers.append("Set-Cookie", "emdash-locale=ja; Path=/; SameSite=Lax; Max-Age=31536000");
    return res;
  }

  // =========================================================================
  // 2.5 記事一覧 (/articles) へのアクセスを /articles/ へリダイレクト
  // =========================================================================
  if (path === "/articles") {
    return Response.redirect(`${url.origin}/articles/`, 308);
  }

  // =========================================================================
  // 2.6 ルート直下の記事スラッグ (/:slug) を /articles/:slug へ転送
  // =========================================================================
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  if (
    cleanPath &&
    !cleanPath.includes("/") &&
    !path.startsWith("/_emdash") &&
    !path.startsWith("/api") &&
    !path.startsWith("/articles") &&
    !["mcp-showcase", "privacy", "contact"].includes(cleanPath)
  ) {
    const cleanSlug = cleanPath.replace(/^post_/, "");
    const isArticle = ARTICLES.some((a: any) => a.slug === cleanPath || a.slug === cleanSlug);
    if (isArticle) {
      return Response.redirect(`${url.origin}/articles/${cleanSlug}`, 308);
    }
  }

  // =========================================================================
  // 3. 公開ブログ記事 (/articles/:slug) のフォールバック レンダリング
  // =========================================================================
  if (path.startsWith("/articles/")) {
    const slug = path.slice("/articles/".length).replace(/\/+$/, "");
    const cleanSlug = slug.replace(/^post_/, "");

    // A. まず静的プリレンダー HTML を ASSETS から取得試行
    try {
      const cfEnv = env as any;
      if (cfEnv?.ASSETS) {
        const assetUrl = new URL(`/articles/${slug}/index.html`, url.origin);
        const res = await cfEnv.ASSETS.fetch(assetUrl);
        if (res && res.status === 200) {
          return res;
        }
      }
    } catch {}

    // B. 静的アセットになければ D1 データベースから記事を取得して美麗レンダリング！
    const db = getDb();
    let post: any = null;
    if (db) {
      try {
        post = await db.prepare("SELECT * FROM ec_posts WHERE slug = ? OR slug = ? OR id = ? OR id = ?")
          .bind(slug, cleanSlug, slug, `post_${cleanSlug}`)
          .first();
      } catch {}
    }

    if (!post) {
      // articles.ts 定義のメタデータから検索
      const fallbackMeta = ARTICLES.find((a) => a.slug === slug || a.slug === cleanSlug);
      if (fallbackMeta) {
        post = {
          title: fallbackMeta.title,
          content: fallbackMeta.content || `<div class="prose"><p>${fallbackMeta.excerpt}</p></div>`,
          excerpt: fallbackMeta.excerpt,
          published_at: fallbackMeta.pubDate,
        };
      }
    }

    if (post) {
      // 1. タイトル補正（「無題」や空文字の完全撲滅）
      if (!post.title || post.title === "無題") {
        try {
          const parsed = typeof post.data === "string" ? JSON.parse(post.data) : post.data;
          if (parsed?.title && parsed.title !== "無題") post.title = parsed.title;
        } catch {}
      }
      if (!post.title || post.title === "無題") {
        const matched = ARTICLES.find((a: any) => a.slug === slug || a.slug === cleanSlug);
        if (matched?.title) post.title = matched.title;
      }

      // 2. 本文補正
      if (!post.content || post.content.trim() === "") {
        try {
          const parsed = typeof post.data === "string" ? JSON.parse(post.data) : post.data;
          if (parsed?.content) post.content = parsed.content;
        } catch {}
      }
      if (!post.content || post.content.trim() === "") {
        const matched = ARTICLES.find((a: any) => a.slug === slug || a.slug === cleanSlug);
        if (matched?.content) post.content = matched.content;
        else if (matched?.excerpt) post.content = `<div class="prose"><p>${matched.excerpt}</p></div>`;
      }

      // 3. 抜粋補正
      if (!post.excerpt) {
        const matched = ARTICLES.find((a: any) => a.slug === slug || a.slug === cleanSlug);
        if (matched?.excerpt) post.excerpt = matched.excerpt;
      }

      const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} ｜ Smart AI Life</title>
  <meta name="description" content="${post.excerpt || ""}">
  <link rel="stylesheet" href="/_astro/styles.qJevY_AE.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.8; color: #1e293b; background: #f8fafc; margin: 0; padding: 0; }
    .header-bar { background: #0f172a; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header-bar a { color: #38bdf8; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .container { max-width: 860px; margin: 40px auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .breadcrumb { font-size: 0.9rem; color: #64748b; margin-bottom: 24px; }
    .breadcrumb a { color: #0284c7; text-decoration: none; }
    .article-title { font-size: 2rem; font-weight: 800; line-height: 1.4; color: #0f172a; margin-bottom: 16px; }
    .meta-info { font-size: 0.9rem; color: #64748b; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
    .author-card { display: flex; align-items: center; gap: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 32px; }
    .author-avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #22c55e; }
    .author-text { font-size: 0.9rem; color: #166534; }
    .content-body { font-size: 1.05rem; line-height: 1.85; color: #334155; }
    .footer-bar { text-align: center; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.85rem; }

    /* テック系コードブロック コンテナ */
    .code-block-container {
      position: relative;
      margin: 1.75rem 0;
      background: #0d1117 !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      border-radius: 12px !important;
      overflow: hidden;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.5);
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    }
    .code-block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 1rem;
      background: #161b22;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      user-select: none;
    }
    .code-block-dots {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .code-block-dots .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .code-block-dots .dot.red { background-color: #ff5f56; }
    .code-block-dots .dot.yellow { background-color: #ffbd2e; }
    .code-block-dots .dot.green { background-color: #27c93f; }
    .code-block-lang {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-left: 10px;
      margin-right: auto;
    }
    .copy-code-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }
    .copy-code-btn:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
    .copy-code-btn:active { transform: translateY(0); }
    .copy-code-btn.copied {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
    }
    .code-block-body {
      position: relative;
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
    }
    .code-block-body pre {
      margin: 0 !important;
      padding: 1.1rem 1.25rem !important;
      overflow-x: auto !important;
      background: transparent !important;
      color: #e2e8f0 !important;
      font-size: 0.88rem !important;
      line-height: 1.65 !important;
      white-space: pre !important;
      font-family: inherit !important;
    }
    .code-block-body pre code {
      background: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      color: inherit !important;
      font-size: inherit !important;
      border: none !important;
    }
    .code-block-body pre::-webkit-scrollbar { height: 8px; }
    .code-block-body pre::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .code-block-body pre::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
  </style>
</head>
<body>
  <header class="header-bar">
    <a href="/">🐼 Smart AI Life</a>
    <a href="/articles/" style="font-size: 0.95rem; color: #cbd5e1;">記事一覧 →</a>
  </header>
  <main class="container">
    <nav class="breadcrumb">
      <a href="/">ホーム</a> / <a href="/articles/">記事一覧</a> / <span>記事詳細</span>
    </nav>
    <article>
      <h1 class="article-title">${post.title}</h1>
      <div class="meta-info">
        <span>📅 ${post.published_at || post.created_at || "2026-10-18"}</span> ｜ <span>✍️ ぽトル (Pottle)</span>
      </div>
      <div class="author-card">
        <img src="https://cdn-ak.f.st-hatena.com/images/fotolife/M/MyToyotaHomeBottle/20261003/20261003213941.jpg" alt="ぽトル" class="author-avatar" />
        <div class="author-text">
          <strong>ぽトル（Pottle）｜ 省エネ脱力パンダ</strong><br>
          生成AI・Mac自動化・自作HEMS・ローカルLLMで日々の生活を快適にする実践ブログ。
        </div>
      </div>
      <div class="content-body">
        ${post.content || post.excerpt || "<p>本文を読み込んでいます...</p>"}
      </div>
    </article>
    <div class="footer-bar">
      © 2026 Smart AI Life ｜ Powered by EmDash & Cloudflare Pages
    </div>
  </main>
  <script>
    (() => {
      function detectLanguage(codeText, preEl) {
        const codeEl = preEl.querySelector('code');
        const classStr = ((preEl.className || '') + ' ' + (codeEl ? codeEl.className || '' : '')).toLowerCase();
        const match = classStr.match(/(?:lang|language)-([a-z0-9_-]+)/i);
        if (match && match[1]) return match[1].toUpperCase();

        const dataLang = preEl.getAttribute('data-language') || (codeEl && codeEl.getAttribute('data-language'));
        if (dataLang) return dataLang.toUpperCase();

        const trimmed = codeText.trim();
        if (trimmed.includes('│') || trimmed.includes('┌') || trimmed.includes('└') || trimmed.includes('─') || trimmed.includes('▼') || trimmed.includes('▲') || trimmed.includes('-->')) return 'ARCHITECTURE';
        if (trimmed.startsWith('{') && (trimmed.endsWith('}') || trimmed.includes('"mcpServers"') || trimmed.includes('"dependencies"'))) return 'JSON';
        if (trimmed.startsWith('#!') || trimmed.startsWith('curl ') || trimmed.startsWith('npm ') || trimmed.startsWith('npx ') || trimmed.startsWith('docker ') || trimmed.startsWith('git ') || trimmed.startsWith('export ') || trimmed.startsWith('python3 ') || trimmed.startsWith('ls ') || trimmed.includes('\\\\n') || trimmed.includes(' && ')) return 'BASH';
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ') || trimmed.startsWith('def ') || trimmed.includes('print(')) return 'PYTHON';
        if (trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('function ') || trimmed.includes('=>') || trimmed.includes('console.log')) return 'JAVASCRIPT';
        if (trimmed.startsWith('SELECT ') || trimmed.startsWith('INSERT ') || trimmed.startsWith('CREATE TABLE')) return 'SQL';
        if (trimmed.startsWith('<') && (trimmed.endsWith('>') || trimmed.includes('</'))) return 'HTML';
        return 'CODE';
      }

      function enhanceCodeBlocks() {
        const preElements = Array.from(document.querySelectorAll('pre'));
        const codeLikeDivs = Array.from(document.querySelectorAll('div')).filter((d) => {
          if (d.closest('.code-block-container') || d.classList.contains('enhanced-code')) return false;
          const s = d.getAttribute('style') || '';
          return (s.includes('#1e293b') || s.includes('#0f172a')) && (s.includes('monospace') || s.includes('pre'));
        });

        const targets = [...preElements, ...codeLikeDivs];

        targets.forEach((el) => {
          if (el.closest('.code-block-container') || el.classList.contains('enhanced-code')) return;
          el.classList.add('enhanced-code');

          const rawCode = el.innerText || el.textContent || '';
          const lang = detectLanguage(rawCode, el);

          const container = document.createElement('div');
          container.className = 'code-block-container';

          const header = document.createElement('div');
          header.className = 'code-block-header';
          header.innerHTML = \`
            <div class="code-block-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="code-block-lang">\${lang}</span>
            <button class="copy-code-btn" type="button" aria-label="コードをコピー">
              <svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="copy-text">コピー</span>
            </button>
          \`;

          const body = document.createElement('div');
          body.className = 'code-block-body';

          const pre = el.tagName === 'PRE' ? el : document.createElement('pre');
          if (el.tagName !== 'PRE') {
            const code = document.createElement('code');
            code.textContent = rawCode.trim();
            pre.appendChild(code);
          }

          const parent = el.parentElement;
          const isInlineWrapperDiv = parent && 
            parent.tagName === 'DIV' && 
            parent.children.length === 1 && 
            parent.getAttribute('style') && 
            (parent.getAttribute('style').includes('0f172a') || parent.getAttribute('style').includes('1e293b'));

          if (isInlineWrapperDiv) {
            parent.parentNode.insertBefore(container, parent);
            body.appendChild(pre);
            container.appendChild(header);
            container.appendChild(body);
            parent.remove();
          } else {
            el.parentNode.insertBefore(container, el);
            body.appendChild(pre);
            container.appendChild(header);
            container.appendChild(body);
            if (el.tagName !== 'PRE') {
              el.remove();
            }
          }

          const copyBtn = header.querySelector('.copy-code-btn');
          const copyTextEl = copyBtn.querySelector('.copy-text');
          const copyIcon = copyBtn.querySelector('.copy-icon');

          copyBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(rawCode.trim());
              copyBtn.classList.add('copied');
              copyTextEl.textContent = 'コピー完了！';
              copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
              setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyTextEl.textContent = 'コピー';
                copyIcon.innerHTML = \`
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                \`;
              }, 1800);
            } catch (err) {
              const textarea = document.createElement('textarea');
              textarea.value = rawCode.trim();
              textarea.style.position = 'fixed';
              textarea.style.opacity = '0';
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
              copyBtn.classList.add('copied');
              copyTextEl.textContent = 'コピー完了！';
              setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyTextEl.textContent = 'コピー';
              }, 1800);
            }
          });
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
      } else {
        enhanceCodeBlocks();
      }
    })();
  </script>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=3600",
          "x-handled-by": "smartailife-d1-renderer",
        },
      });
    }
  }

  // =========================================================================
  // 4. 静的アセット（ASSETS）の自動フォールバック
  // =========================================================================
  try {
    const cfEnv = env as any;
    if (cfEnv?.ASSETS) {
      // 1. そのまま
      let assetRes = await cfEnv.ASSETS.fetch(context.request.url);
      if (assetRes && assetRes.status === 200) return assetRes;

      // 2. index.html 付与
      const indexUrl = new URL(rawPath.endsWith("/") ? rawPath + "index.html" : rawPath + "/index.html", url.origin);
      assetRes = await cfEnv.ASSETS.fetch(indexUrl);
      if (assetRes && assetRes.status === 200) return assetRes;
    }
  } catch {}

  // =========================================================================
  // 5. それ以外は 404
  // =========================================================================
  return new Response("Not found", { status: 404 });
}

export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const DELETE = ALL;
export const PATCH = ALL;
