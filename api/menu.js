import { getDb } from './_mongo.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const db = await getDb()
    const doc = await db.collection('menu').findOne({ _id: 'current' })
    if (!doc) {
      res.status(404).json({ error: 'Menu not found' })
      return
    }
    const { _id, ...payload } = doc
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(payload)
  } catch (e) {
    console.error('GET /api/menu error', e)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
