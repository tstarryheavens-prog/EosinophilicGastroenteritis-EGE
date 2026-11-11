/**
 * 公開サイト（読者向け）とカンパニー運営側（社内向け）の境界定義。
 *
 * 原則:
 *  - 一般公開ページ / その下位ページから、運営機能（HUD・CMS・進捗管理・LAN内ツール）へ向かう導線は置かない。
 *  - 運営ルートは認証なしでは存在自体を見せない（404 + noindex）。
 *  - 運営コンソールの実体はローカル専用 HUD (ASUSTOR NAS / Docker / port 8899)。
 *    公開エッジの /company は、そのローカルHUDへ戻るための認証ゲートとしてのみ存在する。
 *  - 自動入稿パイプライン（ai_company 配下のスクリプト）は共有シム
 *    ai_company/scripts/emdash_auth.py 経由で運営トークンを付与して書き込む。
 */

/** 運営側UIルート（全メソッド認証必須・未認証時は 404 で隠す） */
export const OPS_UI_PREFIXES: string[] = [
  "/_emdash/admin",
  "/_emdash/manifest",
  "/dashboard",
  "/dashboard.html",
  "/company",
  "/api/init-db",
  "/api/test",
];

/** 運営側API（内部データ・ユーザー一覧・設定等）。全メソッド認証必須・未認証時は 404 */
export const OPS_PRIVATE_API_PREFIXES: string[] = [
  "/_emdash/api/users",
  "/_emdash/api/admin",
  "/_emdash/api/settings",
  "/_emdash/api/media",
  "/_emdash/api/schema",
  "/_emdash/api/plugins",
  "/_emdash/api/menus",
  "/_emdash/api/redirects",
  "/_emdash/api/bylines",
  "/_emdash/api/byline-schema",
  "/_emdash/api/relations",
  "/_emdash/api/dashboard",
  "/_emdash/api/calendar",
  "/_emdash/api/taxonomies",
];

/** 記事/API 読み取りは公開維持（記事自体が公開情報）、書き込みのみトークン必須 */
export const OPS_WRITE_API_PREFIXES: string[] = [
  "/_emdash/api/content/posts",
  "/_emdash/api/content/pages",
];

/** 書き込みとみなす HTTP メソッド */
export const OPS_WRITE_METHODS: string[] = ["POST", "PUT", "PATCH", "DELETE"];

/** 管理画面SPAの静的アセット（シェル自体はゲート済み、バンドル自体に秘密はない） */
export const OPS_OPEN_ASSET_PREFIXES: string[] = [
  "/_emdash/_internal_admin_assets",
];

/** 運営ルートへの認証に使う Cookie 名 */
export const OPS_COOKIE = "sla_ops";

/** トークン本体を読む環境変数（Cloudflare Pages の Settings → Environment variables） */
export const OPS_TOKEN_ENV_KEYS: string[] = ["SLA_OPS_TOKEN", "OPS_TOKEN"];

/** トークンハッシュを直接Injectできる環境変数 */
export const OPS_TOKEN_HASH_ENV_KEYS: string[] = ["SLA_OPS_TOKEN_SHA256", "OPS_TOKEN_SHA256"];

/**
 * 運営者トークンの SHA-256（公開リポジトリには平文を持たせない）。
 * 平文トークンはローカル/NAS の ai_company/config/credentials/ops.credentials.json と
 * ルート .dev.vars でのみ保持する。
 * 更新手順:
 *   1. python3 -c "import secrets;print('sla_ops_'+secrets.token_hex(8))"
 *   2. 上の2ファイルと Cloudflare Pages の SLA_OPS_TOKEN を差し替え
 *   3. ここに新トークンの sha256 を記述
 */
export const OPS_TOKEN_SHA256 =
  "de76868ceecd01598531ca6e178139188fc520b4f1111c0d79e7e89ccd4678cc";

/** 互換性のための旧名（ハッシュ値を返す。平文フォールバックは廃止） */
export const OPS_TOKEN_FALLBACK_HASH = OPS_TOKEN_SHA256;

/** ローカル専用HUD（公開ページからは絶対にリンクしない） */
export const LOCAL_HUD_URL = "http://192.168.2.100:8899";

/** 公開ページに流出してはならないローカルアドレス検出パターン */
export const LOCAL_ADDRESS_REGEX =
  /(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|100\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost|127\.0\.0\.1|\[::1\])(:\d{2,5})?/;

/** 公開ナビに含めてよい読者向けルートのみ（/ops-login はナビゲーションには出さない） */
export const PUBLIC_NAV_ROUTES: string[] = [
  "/",
  "/articles",
  "/divisions",
  "/craft",
  "/privacy",
  "/contact",
  "/en",
];
