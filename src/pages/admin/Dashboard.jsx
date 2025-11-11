import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import ProductForm from '../../components/admin/ProductForm'
import ProductList from '../../components/admin/ProductList'
import CategoryManager from '../../components/admin/CategoryManager'

export default function AdminDashboard() {
  const { categories, logout, resetToDefault } = useAdmin()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '')

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع البيانات للإعدادات الافتراضية؟ سيتم حذف جميع التعديلات!')) {
      resetToDefault()
      alert('تم إعادة التعيين بنجاح!')
    }
  }

  const totalProducts = categories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">لوحة التحكم</h1>
            <p className="text-sm text-gray-600">إدارة المنتجات والتصنيفات</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              عرض الموقع
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              إعادة تعيين
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">إجمالي التصنيفات</div>
            <div className="text-3xl font-bold text-brand-primary">{categories.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">إجمالي المنتجات</div>
            <div className="text-3xl font-bold text-green-600">{totalProducts}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">متوسط المنتجات لكل تصنيف</div>
            <div className="text-3xl font-bold text-blue-600">
              {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'products'
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                إدارة المنتجات
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'categories'
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                إدارة التصنيفات
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' ? (
              <div className="space-y-8">
                {/* Add Product Form */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">إضافة منتج جديد</h2>
                  <ProductForm 
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                {/* Products List */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">قائمة المنتجات</h2>
                  <ProductList />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">إدارة التصنيفات</h2>
                <CategoryManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
