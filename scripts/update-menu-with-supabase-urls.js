// Script to update menu.js with Supabase URLs
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseImagesPath = join(__dirname, '../src/data/supabase-images.json')
const uploadedImagesPath = join(__dirname, '../src/data/uploaded-images.json')
const menuPath = join(__dirname, '../src/data/menu.js')

// Check if supabase-images.json exists
if (!fs.existsSync(supabaseImagesPath)) {
  console.error('❌ Error: supabase-images.json not found!')
  console.error('   Run first: npm run upload-supabase-images')
  process.exit(1)
}

// Load mappings
const supabaseImages = JSON.parse(fs.readFileSync(supabaseImagesPath, 'utf-8'))
const uploadedImages = JSON.parse(fs.readFileSync(uploadedImagesPath, 'utf-8'))

// Create reverse mapping: Catbox URL → Local filename
const catboxToFilename = {}
for (const [filename, catboxUrl] of Object.entries(uploadedImages)) {
  catboxToFilename[catboxUrl] = filename
}

// Read menu.js
let menuContent = fs.readFileSync(menuPath, 'utf-8')

console.log('🔄 Updating menu.js with Supabase URLs...\n')

let replacementCount = 0

// Replace all Catbox URLs with Supabase URLs
for (const [catboxUrl, filename] of Object.entries(catboxToFilename)) {
  const supabaseUrl = supabaseImages[filename]
  
  if (supabaseUrl) {
    const regex = new RegExp(catboxUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    const matches = menuContent.match(regex)
    
    if (matches) {
      menuContent = menuContent.replace(regex, supabaseUrl)
      console.log(`✅ Replaced: ${filename}`)
      console.log(`   Old: ${catboxUrl}`)
      console.log(`   New: ${supabaseUrl}\n`)
      replacementCount += matches.length
    }
  }
}

// Write updated menu.js
if (replacementCount > 0) {
  fs.writeFileSync(menuPath, menuContent, 'utf-8')
  
  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Replaced ${replacementCount} image URLs`)
  console.log(`   💾 Updated: src/data/menu.js`)
  console.log(`\n🎉 Done! All images now use Supabase URLs.`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. Test the site: npm run dev`)
  console.log(`   2. Verify images load correctly`)
  console.log(`   3. Commit changes: git add . && git commit -m "Migrate images to Supabase Storage"`)
  console.log(`   4. Push to GitHub: git push`)
} else {
  console.log('⚠️ No replacements made. Check if URLs match.')
}
