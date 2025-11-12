#!/usr/bin/env node
// Import categories/products from src/data/menu.js into Firestore
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '..')
const FIREBASE_MAP_PATH = path.join(ROOT, 'src', 'data', 'firebase-images.json')

// Load menu data (ESM)
const menuModuleUrl = new URL('../src/data/menu.js', import.meta.url)
const { categories } = await import(menuModuleUrl.href)

function loadImageMap() {
  try {
    if (fs.existsSync(FIREBASE_MAP_PATH)) {
      return JSON.parse(fs.readFileSync(FIREBASE_MAP_PATH, 'utf8'))
    }
  } catch (_) {}
  return {}
}

function getBucketName() {
  const explicit = process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET
  if (explicit) return explicit
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  if (projectId) return `${projectId}.appspot.com`
  return null
}

function initAdmin() {
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT
  try {
    if (saPath && fs.existsSync(saPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'))
      initializeApp({ credential: cert(serviceAccount) })
      console.log('✅ Initialized Firebase Admin with service account file')
    } else {
      initializeApp({ credential: applicationDefault() })
      console.log('✅ Initialized Firebase Admin using application default credentials')
    }
  } catch (e) {
    console.error('❌ Failed to initialize Firebase Admin:', e.message)
    process.exit(1)
  }
  return getFirestore()
}

function stableId(catId, name) {
  return crypto.createHash('sha1').update(`${catId}|${name}`).digest('hex')
}

function toUrlFromMap(p, map) {
  if (!p) return null
  const file = path.basename(p)
  return map[file] || null
}

async function main() {
  const db = initAdmin()
  const imageMap = loadImageMap()
  const bucket = getBucketName()
  if (!Object.keys(imageMap).length) {
    console.warn('⚠️ firebase-images.json not found or empty. Consider running upload-images-to-firebase.js first.')
  }
  if (!bucket) {
    console.warn('⚠️ FIREBASE_STORAGE_BUCKET could not be derived. Image URLs in Firestore will rely on mapping file only.')
  }

  let catCount = 0
  let prodCount = 0

  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci]
    const catDoc = {
      id: cat.id,
      name: cat.name,
      image: cat.image || null,
      display_order: ci,
      updated_at: new Date().toISOString(),
    }
    await db.collection('categories').doc(cat.id).set(catDoc, { merge: true })
    catCount++

    for (let pi = 0; pi < (cat.items || []).length; pi++) {
      const it = cat.items[pi]
      const docId = stableId(cat.id, it.name)
      const imageUrl = toUrlFromMap(it.image, imageMap)
      const imagesUrl = Array.isArray(it.images) ? it.images.map(img => toUrlFromMap(img, imageMap)).filter(Boolean) : undefined

      const prodDoc = {
        name: it.name,
        price: it.price ?? null,
        description: it.desc || null,
        image: imageUrl || null,
        images: imagesUrl || null,
        category_id: cat.id,
        display_order: pi,
        updated_at: new Date().toISOString(),
      }
      await db.collection('products').doc(docId).set(prodDoc, { merge: true })
      prodCount++
    }
  }

  console.log(`\n✅ Imported ${catCount} categories and ${prodCount} products into Firestore.`)
  if (!Object.keys(imageMap).length) {
    console.log('ℹ️ You can re-run after uploading images to populate image URLs.')
  }
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
