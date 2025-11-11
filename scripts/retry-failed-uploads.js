import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import FormData from 'form-data'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const imagesDir = join(__dirname, '../public/images/products')
const uploadedFile = join(__dirname, '../src/data/uploaded-images.json')

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
  console.log('🔄 جاري إعادة رفع الصور الفاشلة...\n')
  
  // قراءة الصور المرفوعة سابقاً
  const uploaded = JSON.parse(await readFile(uploadedFile, 'utf-8'))
  
  // قراءة جميع الصور
  const allFiles = await readdir(imagesDir)
  const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
  
  // تحديد الصور الفاشلة
  const failedFiles = imageFiles.filter(f => !uploaded[f])
  
  console.log(`📋 عدد الصور الفاشلة: ${failedFiles.length}\n`)
  
  let successCount = 0
  
  for (const file of failedFiles) {
    const filePath = join(imagesDir, file)
    console.log(`⏳ رفع: ${file}...`)
    
    const url = await uploadToCatbox(filePath, file)
    
    if (url) {
      uploaded[file] = url
      console.log(`✅ نجح: ${url}\n`)
      successCount++
      
      // حفظ بعد كل صورة ناجحة
      await writeFile(uploadedFile, JSON.stringify(uploaded, null, 2), 'utf-8')
      
      // تأخير بين الطلبات
      await new Promise(resolve => setTimeout(resolve, 2000))
    } else {
      console.log(`❌ فشل: ${file}\n`)
    }
  }
  
  console.log(`\n✨ تم رفع ${successCount} من ${failedFiles.length} صورة`)
  console.log(`📊 إجمالي الصور المرفوعة: ${Object.keys(uploaded).length} من ${imageFiles.length}`)
}

main().catch(console.error)
