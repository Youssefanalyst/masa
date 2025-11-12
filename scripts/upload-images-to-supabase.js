// Script to download images from Catbox and upload them to Supabase Storage
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
dotenv.config({ path: join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Load uploaded images mapping
const uploadedImages = JSON.parse(
  fs.readFileSync(join(__dirname, '../src/data/uploaded-images.json'), 'utf-8')
)

// Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }

      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

// Get file extension from URL
function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  return match ? match[1].toLowerCase() : 'jpg'
}

async function uploadImagesToSupabase() {
  console.log('🚀 Starting image upload to Supabase Storage...\n')

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

    // Upload each image
    for (const [filename, catboxUrl] of Object.entries(uploadedImages)) {
      try {
        console.log(`📥 Downloading: ${filename}`)
        const imageBuffer = await downloadImage(catboxUrl)
        
        // Generate clean filename
        const ext = getExtension(catboxUrl)
        const cleanFilename = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') + '.' + ext
        const storageFilename = `products/${cleanFilename}`
        
        console.log(`📤 Uploading to Supabase: ${storageFilename}`)
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(storageFilename, imageBuffer, {
            contentType: `image/${ext}`,
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
    console.log(`   📁 Total: ${Object.keys(uploadedImages).length}`)
    console.log(`\n💾 New URLs saved to: src/data/supabase-images.json`)
    console.log(`\n🎉 Done! Now update menu.js to use the new Supabase URLs.`)

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the upload
uploadImagesToSupabase()
