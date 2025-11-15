// Generate sitemap.xml and update robots.txt with the correct absolute site URL
// Usage: runs automatically via `npm run prebuild`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Prefer SITE_URL, then VITE_SITE_URL, fallback to empty (will produce relative URLs)
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '')

// Project public dir
const publicDir = path.join(__dirname, '..', 'public')

// Known SPA routes
const routes = [
  '/',
  '/menu',
  '/about',
  '/contact'
]

// ISO date for <lastmod>
const today = new Date().toISOString().slice(0, 10)

function toAbsolute(urlPath) {
  if (!SITE_URL) return urlPath // fallback to relative
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
  return `${SITE_URL}${cleanPath}`
}

function generateSitemap() {
  const items = routes.map(route => `  <url>\n    <loc>${toAbsolute(route)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')

  // add one image for homepage (hero / placeholder)
  const heroImage = toAbsolute('/images/placeholder.svg')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${toAbsolute('/')}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n    <image:image>\n      <image:loc>${heroImage}</image:loc>\n      <image:title>مطبخ ماسة</image:title>\n    </image:image>\n  </url>\n${items}\n</urlset>\n`

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
}

function updateRobots() {
  const robotsPath = path.join(publicDir, 'robots.txt')
  let robots = ''
  if (fs.existsSync(robotsPath)) robots = fs.readFileSync(robotsPath, 'utf8')

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    '',
    '# Sitemaps',
    `Sitemap: ${toAbsolute('/sitemap.xml')}`,
    '',
    '# Crawl delay',
    'Crawl-delay: 1',
    ''
  ]
  fs.writeFileSync(robotsPath, lines.join('\n'), 'utf8')
}

try {
  if (!fs.existsSync(publicDir)) {
    console.warn('public/ directory not found, skipping sitemap/robots generation')
  } else {
    generateSitemap()
    updateRobots()
    console.log('✅ Generated sitemap.xml and updated robots.txt using SITE_URL=', SITE_URL || '(relative)')
  }
} catch (err) {
  console.warn('⚠️ Failed to generate sitemap/robots:', err.message)
}
