import { createContext, useContext, useState, useEffect } from 'react'
import { categories as initialCategories } from '../data/menu'


const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState([])

  // Load data on mount from localStorage
  useEffect(() => {
    loadCategories()
    
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'masa-admin-authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  const loadCategories = () => {
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

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
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
  const addProduct = (categoryId, product) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: [...(cat.items || []), product] }
          : cat
      )
    )
    return true
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
