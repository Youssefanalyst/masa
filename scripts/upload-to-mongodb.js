#!/usr/bin/env node
/**
 * Upload menu data and product images to MongoDB Atlas (GridFS + collection)
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." npm run upload:mongo
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient, GridFSBucket } from 'mongodb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO || ''
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI environment variable')
  process.exit(1)
}

async function main() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db('masa')
  const bucket = new GridFSBucket(db, { bucketName: 'images' })

  // Load menu module dynamically to get categories
  const menuModuleUrl = new URL('../src/data/menu.js', import.meta.url)
  const { categories, restaurantName, tagline, currency } = await import(menuModuleUrl.href)

  // Map original local image path => GridFS fileId string
  const imageIdMap = new Map()

  async function uploadImage(localPath) {
    if (!localPath) return null
    if (/^https?:\/\//i.test(localPath)) return localPath // already URL
    if (imageIdMap.has(localPath)) return imageIdMap.get(localPath)

    const absolute = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''))
    if (!fs.existsSync(absolute)) {
      console.warn('⚠️ Image not found:', absolute)
      return null
    }

    const uploadStream = bucket.openUploadStream(path.basename(localPath))
    await new Promise((res, rej) => {
      fs.createReadStream(absolute).pipe(uploadStream)
        .on('error', rej)
        .on('finish', res)
    })
    const fileId = uploadStream.id.toString()
    imageIdMap.set(localPath, fileId)
    console.log('📦 Uploaded image', localPath, '->', fileId)
    return `/api/images/${fileId}`
  }

  // Deep clone categories and replace images
  const clonedCats = JSON.parse(JSON.stringify(categories))
  for (const cat of clonedCats) {
    cat.image = await uploadImage(cat.image)
    if (Array.isArray(cat.items)) {
      for (const item of cat.items) {
        item.image = await uploadImage(item.image)
        if (Array.isArray(item.images)) {
          for (let i = 0; i < item.images.length; i++) {
            item.images[i] = await uploadImage(item.images[i])
          }
        }
      }
    }
  }

  const menuDoc = {
    _id: 'current',
    restaurantName,
    tagline,
    currency,
    lastUpdated: new Date(),
    categories: clonedCats,
  }

  await db.collection('menu').replaceOne({ _id: 'current' }, menuDoc, { upsert: true })
  console.log('✅ Menu document saved to MongoDB')

  await client.close()
  console.log('🎉 Done')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
