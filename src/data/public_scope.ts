/**
 * 一般公開してよい領域 / 運営面（NAS 側）だけで扱う領域の単一の定義。
 *
 * 公開面 : https://ai-living-lab.pages.dev  (Astro + Cloudflare Pages)
 * 運営面 : NAS HUD http://192.168.2.100:8899 ・ NAS WebUI (Port 8520 など)
 *
 * モータ学術論文 (site_id = motor-paper) は一般公開しない。
 * 論文DB・全文インデックス・AI速報は NAS ローカル側でのみ扱う（ユーザー指示）。
 */
export const INTERNAL_SITE_IDS: readonly string[] = ['motor-paper'];

/** site_id を持たない論文由来の記事を slug から判定する接頭辞 */
export const INTERNAL_SLUG_PREFIXES: readonly string[] = ['motor-paper', 'motor_paper'];

export function isInternalSiteId(id?: string | null): boolean {
  if (!id) return false;
  return INTERNAL_SITE_IDS.includes(String(id));
}

export function isInternalSlug(slug?: string | null): boolean {
  if (!slug) return false;
  const s = String(slug).toLowerCase();
  return INTERNAL_SLUG_PREFIXES.some((p) => s === p || s.startsWith(p));
}

export function isPublicArticle(
  a?: { slug?: string | null; siteId?: string | null; site_id?: string | null } | null
): boolean {
  if (!a) return false;
  if (isInternalSiteId(a.siteId) || isInternalSiteId(a.site_id)) return false;
  if (isInternalSlug(a.slug)) return false;
  return true;
}

/** D1 の WHERE 句に渡す `NOT IN (?, ?)` 用のプレースホルダ列 */
export function internalPlaceholders(): string {
  return INTERNAL_SITE_IDS.map(() => "?").join(", ");
}

/** SQL 文字列に埋め込む固定値リスト（外部入力ではなくコード側で決めた値のみ） */
export function internalQuotedList(): string {
  return INTERNAL_SITE_IDS.map((v) => `'${v.replace(/'/g, "")}'`).join(", ");
}
