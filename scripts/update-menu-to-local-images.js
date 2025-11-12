// Replace Catbox URLs in menu.js with local /images/products/<filename>
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uploadedImagesPath = join(__dirname, '../src/data/uploaded-images.json')
const menuPath = join(__dirname, '../src/data/menu.js')

if (!fs.existsSync(uploadedImagesPath)) {
  console.error('❌ uploaded-images.json not found')
  process.exit(1)
}

const uploaded = JSON.parse(fs.readFileSync(uploadedImagesPath, 'utf-8'))

// Build reverse map: catbox URL -> local filename
const urlToLocal = {}
for (const [filename, url] of Object.entries(uploaded)) {
  urlToLocal[url] = filename
}

let menuContent = fs.readFileSync(menuPath, 'utf-8')
let replaced = 0

for (const [url, filename] of Object.entries(urlToLocal)) {
  const localPath = `/images/products/${filename}`
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'g')
  const before = menuContent
  menuContent = menuContent.replace(regex, localPath)
  if (menuContent !== before) replaced++
}

fs.writeFileSync(menuPath, menuContent, 'utf-8')
console.log(`✅ Replaced ${replaced} URL groups with local paths.`)
