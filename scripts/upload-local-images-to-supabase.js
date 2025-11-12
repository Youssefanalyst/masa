// Script to upload local images directly to Supabase Storage
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
dotenv.config({ path: join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env')
  console.error('\n📝 Add them to your .env file:')
  console.error('VITE_SUPABASE_URL=https://txihcxvsghkidvfzship.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=your_anon_key_here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const LOCAL_IMAGES_DIR = join(__dirname, '../public/images/products')

// Get file extension
function getExtension(filename) {
  return path.extname(filename).substring(1).toLowerCase()
}

// Get MIME type
function getMimeType(ext) {
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  }
  return mimeTypes[ext] || 'image/jpeg'
}

async function uploadLocalImagesToSupabase() {
  console.log('🚀 Starting local images upload to Supabase Storage...\n')

  const newImageUrls = {}
  let successCount = 0
  let failCount = 0

  try {
    // Check if bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'product-images')
    
    if (!bucketExists) {
      console.log('📦 Creating product-images bucket...')
      const { error: bucketError } = await supabase.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })
      
      if (bucketError) {
        console.error('❌ Error creating bucket:', bucketError.message)
        process.exit(1)
      }
      console.log('✅ Bucket created successfully!\n')
    }

    // Read all files from local directory
    const files = fs.readdirSync(LOCAL_IMAGES_DIR).filter(f => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f) && f !== 'README.txt'
    )

    console.log(`📁 Found ${files.length} images in ${LOCAL_IMAGES_DIR}\n`)

    // Upload each image
    for (const filename of files) {
      try {
        const filePath = join(LOCAL_IMAGES_DIR, filename)
        console.log(`📤 Uploading: ${filename}`)
        
        const fileBuffer = fs.readFileSync(filePath)
        const ext = getExtension(filename)
        const storageFilename = `products/${filename}`
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(storageFilename, fileBuffer, {
            contentType: getMimeType(ext),
            upsert: true, // Overwrite if exists
          })

        if (error) {
          console.error(`  ❌ Upload failed: ${error.message}`)
          failCount++
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(storageFilename)
          
          newImageUrls[filename] = publicUrlData.publicUrl
          console.log(`  ✅ Success: ${publicUrlData.publicUrl}\n`)
          successCount++
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}\n`)
        failCount++
      }
    }

    // Save new URLs mapping
    const outputPath = join(__dirname, '../src/data/supabase-images.json')
    fs.writeFileSync(outputPath, JSON.stringify(newImageUrls, null, 2))
    
    console.log('\n\n📊 Upload Summary:')
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Failed: ${failCount}`)
    console.log(`   📁 Total: ${files.length}`)
    console.log(`\n💾 New URLs saved to: src/data/supabase-images.json`)
    
    if (successCount > 0) {
      console.log(`\n🎉 Done! ${successCount} images uploaded successfully!`)
      console.log(`\n📝 Next step: Update menu.js to use Supabase URLs`)
      console.log(`   Run: node scripts/update-menu-with-supabase-urls.js`)
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the upload
uploadLocalImagesToSupabase()
