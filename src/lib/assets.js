// Base URL for assets - use Vite's base URL or root
const base = import.meta.env?.BASE_URL || '/'

export function resolveAssetUrl(url) {
  if (!url) return ''
  
  // If it's already a full URL, return as is
  if (/^https?:\/\//i.test(url)) return encodeURI(url)
  
  // If it starts with a slash, ensure it's prefixed with base
  if (url.startsWith('/')) {
    return encodeURI(`${base}${url.substring(1)}`)
  }
  
  // For relative paths, ensure they're properly prefixed
  if (url.startsWith('images/') || url.startsWith('/images/')) {
    const cleanPath = url.startsWith('/') ? url.substring(1) : url
    return encodeURI(`${base}${cleanPath}`)
  }
  
  // For any other case, assume it's a path that needs the base
  return encodeURI(`${base}${url}`)
}
