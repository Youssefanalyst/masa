export const assetsBase = (import.meta?.env?.VITE_ASSETS_BASE_URL) || 'https://youssefanalyst.github.io/masa'

export function resolveAssetUrl(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/images/products/')) return `${assetsBase}${url}`
  if (url.startsWith('images/products/')) return `${assetsBase}/${url}`
  return url
}
