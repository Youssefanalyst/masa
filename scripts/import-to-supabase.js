// Script to import existing menu data to Supabase
// Run: node scripts/import-to-supabase.js

import { createClient } from '@supabase/supabase-js'
import { categories } from '../src/data/menu.js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

async function importData() {
  console.log('🚀 Starting import to Supabase...\n')

  try {
    // Import categories first
    console.log('📁 Importing categories...')
    for (const [index, category] of categories.entries()) {
      const { error: catError } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          image: category.image,
          display_order: index + 1
        }, { onConflict: 'id' })

      if (catError) {
        console.error(`  ❌ Error importing category "${category.name}":`, catError.message)
      } else {
        console.log(`  ✅ ${category.name}`)
      }
    }

    console.log('\n📦 Importing products...')
    let totalProducts = 0

    for (const category of categories) {
      console.log(`\n  Category: ${category.name}`)
      
      for (const [index, item] of category.items.entries()) {
        const productData = {
          category_id: category.id,
          name: item.name,
          price: item.price || null,
          description: item.desc || null,
          image: item.image || null,
          images: item.images || null,
          display_order: index + 1
        }

        const { error: prodError } = await supabase
          .from('products')
          .insert(productData)

        if (prodError) {
          console.error(`    ❌ Error: ${item.name} - ${prodError.message}`)
        } else {
          console.log(`    ✅ ${item.name}`)
          totalProducts++
        }
      }
    }

    console.log(`\n\n🎉 Import complete!`)
    console.log(`   Categories: ${categories.length}`)
    console.log(`   Products: ${totalProducts}`)
    console.log(`\n✅ All data imported successfully!`)

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the import
importData()
