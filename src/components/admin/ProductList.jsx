import { useState } from 'react'
import { useAdmin } from '../../contexts/AdminContext'
import ProductForm from './ProductForm'

export default function ProductList() {
  const { categories, deleteProduct } = useAdmin()
  const [editingProduct, setEditingProduct] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const handleDelete = (categoryId, productIndex, productName) => {
    if (window.confirm(`هل أنت متأكد من حذف "${productName}"؟`)) {
      deleteProduct(categoryId, productIndex)
      alert('تم حذف المنتج بنجاح!')
    }
  }

  const handleEdit = (categoryId, index, product) => {
    setEditingProduct({ categoryId, index, product })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredCategories = filterCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === filterCategory)

  return (
    <div className="space-y-6">
      {/* Edit Form */}
      {editingProduct && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            تعديل المنتج: {editingProduct.product.name}
          </h3>
          <ProductForm
            editingProduct={editingProduct}
            onEditComplete={() => setEditingProduct(null)}
          />
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <label className="font-semibold text-gray-700">فلترة حسب التصنيف:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
        >
          <option value="all">جميع التصنيفات ({categories.reduce((sum, cat) => sum + cat.items.length, 0)} منتج)</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.items.length} منتج)
            </option>
          ))}
        </select>
      </div>

      {/* Products by Category */}
      {filteredCategories.map(category => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-amber-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-between">
              <span>{category.name}</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {category.items.length} منتج
              </span>
            </h3>
          </div>

          {category.items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد منتجات في هذا التصنيف
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {category.items.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {(item.images || item.image) ? (
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.svg'
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          لا صورة
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                      {item.desc && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.desc}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {item.price && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                            {item.price} ج.م
                          </span>
                        )}
                        {item.images && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            🔄 {item.images.length} صورة متحركة
                          </span>
                        )}
                        {item.image && !item.images && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                            📷 صورة واحدة
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(category.id, index, item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, index, item.name)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لا توجد تصنيفات
        </div>
      )}
    </div>
  )
}
