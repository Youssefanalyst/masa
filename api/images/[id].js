import { ObjectId, GridFSBucket } from 'mongodb'
import { getDb } from '../_mongo.js'

function mimeFromFilename(name = '') {
  const lower = name.toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.bmp')) return 'image/bmp'
  return 'application/octet-stream'
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const id = req.query?.id
    if (!id) {
      res.status(400).json({ error: 'Missing image id' })
      return
    }
    let oid
    try {
      oid = new ObjectId(id)
    } catch {
      res.status(400).json({ error: 'Invalid image id' })
      return
    }

    const db = await getDb()
    const bucket = new GridFSBucket(db, { bucketName: 'images' })
    const file = await db.collection('images.files').findOne({ _id: oid })
    if (!file) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const contentType = file.contentType || mimeFromFilename(file.filename)
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    const stream = bucket.openDownloadStream(oid)
    stream.on('error', () => {
      if (!res.headersSent) res.status(404)
      res.end()
    })
    stream.pipe(res)
  } catch (e) {
    console.error('GET /api/images/[id] error', e)
    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error' })
    else res.end()
  }
}
