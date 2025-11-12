export const assetsBase = (import.meta?.env?.VITE_ASSETS_BASE_URL) || (import.meta?.env?.BASE_URL) || '/'

export function resolveAssetUrl(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/images/products/')) return `${assetsBase}${url}`
  if (url.startsWith('images/products/')) return `${assetsBase}/${url}`
  return url
}
