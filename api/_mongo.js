import { MongoClient } from 'mongodb'

let cachedClient

export async function getMongoClient() {
  if (cachedClient) return cachedClient
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

export async function getDb() {
  const client = await getMongoClient()
  return client.db('masa')
}
