#!/usr/bin/env node
// Build a minimal assets bundle for GitHub Pages: images + menu.json
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'assets-dist')
const OUT_IMAGES = path.join(OUT_DIR, 'images', 'products')
const OUT_DATA = path.join(OUT_DIR, 'data')

// Load menu data from ESM module
const menuModuleUrl = new URL('../src/data/menu.js', import.meta.url)
const { categories, restaurantName, tagline, currency } = await import(menuModuleUrl.href)

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true, force: true })
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
}

function main() {
  console.log('🧩 Building assets bundle for GitHub Pages...')
  ensureDir(OUT_IMAGES)
  ensureDir(OUT_DATA)

  // Export menu.json
  const exported = {
    restaurantName,
    tagline,
    currency,
    lastUpdated: new Date().toISOString(),
    categories,
  }
  writeJson(path.join(OUT_DATA, 'menu.json'), exported)
  console.log('✅ Wrote data/menu.json')

  // Copy product images
  const SRC_IMAGES = path.join(ROOT, 'public', 'images', 'products')
  if (!fs.existsSync(SRC_IMAGES)) {
    console.error('❌ Images source not found:', SRC_IMAGES)
    process.exit(1)
  }
  copyDir(SRC_IMAGES, OUT_IMAGES)
  console.log('✅ Copied images/products')

  console.log('🎉 Done. Output at', path.relative(ROOT, OUT_DIR))
}

main()
