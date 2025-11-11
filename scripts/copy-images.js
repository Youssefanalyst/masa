import { readdir, copyFile, mkdir } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sourceBase = join(__dirname, '../../')
const destBase = join(__dirname, '../public/images/products')

function slugify(name) {
  return name
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

async function findImages(dir) {
  const results = []
  try {
    const items = await readdir(dir, { withFileTypes: true })
    for (const item of items) {
      const fullPath = join(dir, item.name)
      if (item.isDirectory()) {
        // تحقق إن كان المجلد يحتوي على صور
        try {
          const files = await readdir(fullPath)
          const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f))
          if (imageFiles.length > 0) {
            // استخدم أول صورة من المجلد
            results.push({
              productName: item.name,
              sourcePath: join(fullPath, imageFiles[0]),
              ext: extname(imageFiles[0])
            })
          }
        } catch {}
      }
    }
  } catch {}
  return results
}

async function main() {
  console.log('🔍 جاري البحث عن الصور...')
  
  // إنشاء مجلد الوجهة
  if (!existsSync(destBase)) {
    await mkdir(destBase, { recursive: true })
  }

  const categories = ['اخري', 'صواني', 'طبيخ', 'طيور', 'محاشي']
  let copied = 0

  for (const cat of categories) {
    const catPath = join(sourceBase, cat)
    if (!existsSync(catPath)) continue

    console.log(`\n📁 معالجة تصنيف: ${cat}`)
    const images = await findImages(catPath)
    
    for (const img of images) {
      const slug = slugify(img.productName)
      const destPath = join(destBase, `${slug}${img.ext}`)
      
      try {
        await copyFile(img.sourcePath, destPath)
        console.log(`  ✅ نسخ: ${img.productName} → ${slug}${img.ext}`)
        copied++
      } catch (err) {
        console.log(`  ❌ فشل: ${img.productName}`, err.message)
      }
    }
  }

  console.log(`\n✨ تم نسخ ${copied} صورة بنجاح إلى public/images/products`)
}

main().catch(console.error)
