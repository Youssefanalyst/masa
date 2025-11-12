#!/usr/bin/env node
// Upload local product images to Firebase Storage and output a URL mapping
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'images', 'products')
const OUTPUT_JSON = path.join(ROOT, 'src', 'data', 'firebase-images.json')

function getBucketName() {
  const explicit = process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET
  if (explicit) return explicit
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  if (projectId) return `${projectId}.appspot.com`
  throw new Error('FIREBASE_STORAGE_BUCKET or (FIREBASE_PROJECT_ID/VITE_FIREBASE_PROJECT_ID) is required')
}

function initAdmin() {
  const bucketName = getBucketName()
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT
  let options = { storageBucket: bucketName }
  try {
    if (saPath && fs.existsSync(saPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'))
      initializeApp({ credential: cert(serviceAccount), ...options })
      console.log('✅ Initialized Firebase Admin with service account file')
    } else {
      initializeApp({ credential: applicationDefault(), ...options })
      console.log('✅ Initialized Firebase Admin using application default credentials')
    }
  } catch (e) {
    console.error('❌ Failed to initialize Firebase Admin:', e.message)
    process.exit(1)
  }
  return getStorage().bucket()
}

function isImage(file) {
  return /(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.bmp|\.svg)$/i.test(file)
}

async function ensureToken(fileRef) {
  const [metadata] = await fileRef.getMetadata()
  let token = metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens
  if (!token) {
    token = crypto.randomUUID()
    await fileRef.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } })
  }
  return token
}

async function main() {
  const bucket = initAdmin()
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error('❌ Not found:', PRODUCTS_DIR)
    process.exit(1)
  }

  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => isImage(f))
  const mapping = {}
  let uploaded = 0

  for (const f of files) {
    const srcPath = path.join(PRODUCTS_DIR, f)
    const dest = `products/${f}`
    const fileRef = bucket.file(dest)

    const [exists] = await fileRef.exists()
    if (!exists) {
      await bucket.upload(srcPath, {
        destination: dest,
        metadata: {
          cacheControl: 'public, max-age=31536000, immutable',
        },
      })
      uploaded++
      console.log('⬆️ Uploaded', dest)
    } else {
      console.log('↪️ Exists', dest)
    }

    const token = await ensureToken(fileRef)
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`
    mapping[f] = url
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(mapping, null, 2), 'utf8')
  console.log(`\n✅ Done. Uploaded: ${uploaded}, Total mapped: ${files.length}`)
  console.log('📝 Mapping written to', path.relative(ROOT, OUTPUT_JSON))
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
