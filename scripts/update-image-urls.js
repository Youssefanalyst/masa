import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const uploadedFile = join(__dirname, '../src/data/uploaded-images.json')
const menuFile = join(__dirname, '../src/data/menu.js')

async function main() {
  console.log('🔄 جاري تحديث روابط الصور في menu.js...\n')
  
  // قراءة الروابط المرفوعة
  const uploadedData = JSON.parse(await readFile(uploadedFile, 'utf-8'))
  let menuContent = await readFile(menuFile, 'utf-8')
  
  let updateCount = 0
  
  // استبدال المسارات المحلية بالروابط الخارجية
  for (const [fileName, url] of Object.entries(uploadedData)) {
    const localPath = `/images/products/${fileName}`
    if (menuContent.includes(localPath)) {
      menuContent = menuContent.replace(new RegExp(localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), url)
      console.log(`✅ تم تحديث: ${fileName}`)
      updateCount++
    }
  }
  
  // حفظ الملف المحدث
  await writeFile(menuFile, menuContent, 'utf-8')
  
  console.log(`\n✨ تم تحديث ${updateCount} صورة في menu.js`)
  console.log('🎉 الموقع الآن يستخدم روابط catbox.moe!')
}

main().catch(console.error)
