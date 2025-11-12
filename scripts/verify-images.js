// Quick script to verify all images in menu.js are accessible
import https from 'https'
import fs from 'fs'
import path from 'path'
import { categories } from '../src/data/menu.js'

const BASE_PUBLIC = path.join(path.dirname(new URL(import.meta.url).pathname), '../public')

function checkImage(url) {
  // Remote URL
  if (/^https?:\/\//i.test(url)) {
    return new Promise((resolve) => {
      https
        .get(url, (response) => {
          resolve({ url, status: response.statusCode, ok: response.statusCode === 200 })
        })
        .on('error', () => {
          resolve({ url, status: 'ERROR', ok: false })
        })
    })
  }

  // Local file under public/
  const rel = url.replace(/^\//, '')
  const fullPath = path.join(BASE_PUBLIC, rel)
  const exists = fs.existsSync(fullPath)
  const ok = exists && fs.statSync(fullPath).size > 0
  return Promise.resolve({ url, status: exists ? 'LOCAL_OK' : 'LOCAL_MISSING', ok })
}

async function verifyAllImages() {
  console.log('🔍 Verifying all images in menu...\n')
  
  let totalImages = 0
  let workingImages = 0
  let brokenImages = 0
  const brokenUrls = []

  for (const category of categories) {
    console.log(`📁 Category: ${category.name}`)
    
    for (const item of category.items) {
      const images = item.images || (item.image ? [item.image] : [])
      
      for (const imageUrl of images) {
        totalImages++
        const result = await checkImage(imageUrl)
        
        if (result.ok) {
          console.log(`  ✅ ${item.name.substring(0, 40)}...`)
          workingImages++
        } else {
          console.log(`  ❌ ${item.name} - Status: ${result.status}`)
          brokenImages++
          brokenUrls.push({ item: item.name, url: imageUrl })
        }
      }
    }
    console.log('')
  }

  console.log('📊 Summary:')
  console.log(`   Total: ${totalImages}`)
  console.log(`   ✅ Working: ${workingImages}`)
  console.log(`   ❌ Broken: ${brokenImages}`)
  
  if (brokenUrls.length > 0) {
    console.log('\n⚠️ Broken images:')
    brokenUrls.forEach(({ item, url }) => {
      console.log(`   ${item}: ${url}`)
    })
  } else {
    console.log('\n🎉 All images are working!')
  }
}

verifyAllImages()
