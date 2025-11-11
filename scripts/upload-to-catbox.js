import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import FormData from 'form-data'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const imagesDir = join(__dirname, '../public/images/products')
const outputFile = join(__dirname, '../src/data/uploaded-images.json')

async function uploadToCatbox(filePath, fileName) {
  try {
    const fileBuffer = await readFile(filePath)
    const formData = new FormData()
    
    formData.append('reqtype', 'fileupload')
    formData.append('fileToUpload', fileBuffer, fileName)
    
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    })
    
    const url = await response.text()
    return url.trim()
  } catch (error) {
    console.error(`❌ فشل رفع ${fileName}:`, error.message)
    return null
  }
}

async function main() {
  console.log('📤 جاري رفع الصور إلى catbox.moe...\n')
  
  const files = await readdir(imagesDir)
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
  
  const uploaded = {}
  let successCount = 0
  
  for (const file of imageFiles) {
    const filePath = join(imagesDir, file)
    console.log(`⏳ رفع: ${file}...`)
    
    const url = await uploadToCatbox(filePath, file)
    
    if (url) {
      uploaded[file] = url
      console.log(`✅ نجح: ${url}\n`)
      successCount++
      
      // تأخير بسيط بين الطلبات لتجنب الحظر
      await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
      console.log(`❌ فشل: ${file}\n`)
    }
  }
  
  // حفظ النتائج في ملف JSON
  await writeFile(outputFile, JSON.stringify(uploaded, null, 2), 'utf-8')
  
  console.log(`\n✨ تم رفع ${successCount} من ${imageFiles.length} صورة`)
  console.log(`📄 الروابط محفوظة في: src/data/uploaded-images.json`)
  console.log('\n💡 الخطوة التالية: شغّل npm run update-image-urls لتحديث الموقع')
}

main().catch(console.error)
