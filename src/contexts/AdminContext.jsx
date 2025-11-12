import { createContext, useContext, useState, useEffect } from 'react'
import { categories as initialCategories } from '../data/menu'
import { supabase, isSupabaseEnabled } from '../lib/supabase'
import { assetsBase } from '../lib/assets'
 

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState([])

  // Load data on mount (from Supabase or localStorage)
  useEffect(() => {
    loadCategories()
    
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'masa-admin-authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  const loadFromLocalStorage = () => {
    const savedCategories = localStorage.getItem('menuCategories')
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
        console.log('📦 Data loaded from localStorage')
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories(initialCategories)
      }
    } else {
      setCategories(initialCategories)
      console.log('📋 Using initial categories')
    }
  }

  const loadFromRemoteAssets = async () => {
    try {
      const res = await fetch(`${assetsBase}/data/menu.json`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data && Array.isArray(data.categories)) {
        setCategories(data.categories)
        localStorage.setItem('menuCategories', JSON.stringify(data.categories))
        console.log('🌐 Data loaded from GitHub Pages assets')
        return
      }
      throw new Error('Invalid menu.json format')
    } catch (error) {
      console.warn('Remote assets failed, falling back to localStorage/default:', error)
      loadFromLocalStorage()
    }
  }

  // Removed GitHub auto-publish; Vercel deployment will not use client-side tokens

  const loadCategories = async () => {
    if (isSupabaseEnabled()) {
      // Load from Supabase
      try {
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })

        if (catsError) throw catsError

        // Load products for each category
        const { data: products, error: prodsError } = await supabase
          .from('products')
          .select('*')
          .order('display_order', { ascending: true })

        if (prodsError) throw prodsError

        // Group products by category
        const categoriesWithProducts = cats.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: cat.image,
          items: products
            .filter(p => p.category_id === cat.id)
            .map(p => ({
              name: p.name,
              price: p.price,
              desc: p.description,
              image: p.image,
              images: p.images
            }))
        }))

        setCategories(categoriesWithProducts)
        console.log('✅ Data loaded from Supabase')
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error)
        loadFromLocalStorage()
      }
    } else {
      // Prefer localStorage if present (to preserve admin edits), otherwise fetch remote assets
      const saved = localStorage.getItem('menuCategories')
      if (saved) {
        try {
          setCategories(JSON.parse(saved))
          console.log('📦 Data loaded from localStorage (preferred)')
          return
        } catch (e) {
          console.warn('Invalid local categories, trying remote assets:', e)
        }
      }
      await loadFromRemoteAssets()
    }
  }

  // Save categories whenever they change
  useEffect(() => {
    if (categories.length > 0 && !isSupabaseEnabled()) {
      // Only save to localStorage if Supabase is not enabled
      localStorage.setItem('menuCategories', JSON.stringify(categories))
    }
  }, [categories])

  const login = async (password) => {
    // Hash password using SHA-256
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Stored hash of the admin password
    const ADMIN_PASSWORD_HASH = '479f8ac48a267fbce22748f4059bf37af6dabe948b981754c9e458232e94069f'
    
    if (hashHex === ADMIN_PASSWORD_HASH) {
      localStorage.setItem('adminToken', 'masa-admin-authenticated')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  // CRUD Operations
  const addProduct = async (categoryId, product) => {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert({
            category_id: categoryId,
            name: product.name,
            price: product.price,
            description: product.desc,
            image: product.image,
            images: product.images
          })
          .select()

        if (error) throw error
        
        // Reload categories to get updated data
        await loadCategories()
        return true
      } catch (error) {
        console.error('Error adding product:', error)
        return false
      }
    } else {
      // localStorage fallback
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, product] }
            : cat
        )
      )
      return true
    }
  }

  const updateProduct = (categoryId, productIndex, updatedProduct) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item, idx) =>
                idx === productIndex ? updatedProduct : item
              )
            }
          : cat
      )
    )
  }

  const deleteProduct = (categoryId, productIndex) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter((_, idx) => idx !== productIndex)
            }
          : cat
      )
    )
  }

  const addCategory = (category) => {
    setCategories(prev => [...prev, category])
  }

  const updateCategory = (categoryId, updatedCategory) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      )
    )
  }

  const deleteCategory = (categoryId) => {
    setCategories(prevCategories =>
      prevCategories.filter(cat => cat.id !== categoryId)
    )
  }

  const resetToDefault = () => {
    setCategories(initialCategories)
    localStorage.removeItem('menuCategories')
  }

  const value = {
    isAuthenticated,
    categories,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefault
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
