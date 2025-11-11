import { useState } from 'react'
import { useAdmin } from '../../contexts/AdminContext'

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin()
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing category
      updateCategory(editingId, {
        name: formData.name,
        image: formData.image
      })
      alert('تم تحديث التصنيف بنجاح!')
      setEditingId(null)
    } else {
      // Add new category
      if (categories.find(cat => cat.id === formData.id)) {
        alert('المعرف (ID) موجود بالفعل! استخدم معرف مختلف.')
        return
      }
      
      addCategory({
        id: formData.id,
        name: formData.name,
        image: formData.image,
        items: []
      })
      alert('تم إضافة التصنيف بنجاح!')
      setShowAddForm(false)
    }
    
    // Reset form
    setFormData({ id: '', name: '', image: '' })
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setFormData({
      id: category.id,
      name: category.name,
      image: category.image
    })
    setShowAddForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (categoryId, categoryName) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category.items.length > 0) {
      alert(`لا يمكن حذف "${categoryName}" لأنه يحتوي على ${category.items.length} منتج. احذف المنتجات أولاً.`)
      return
    }
    
    if (window.confirm(`هل أنت متأكد من حذف تصنيف "${categoryName}"؟`)) {
      deleteCategory(categoryId)
      alert('تم حذف التصنيف بنجاح!')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ id: '', name: '', image: '' })
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4 border-2 border-brand-primary">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? `تعديل تصنيف: ${formData.name}` : 'إضافة تصنيف جديد'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID (only for new categories) */}
            {!editingId && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المعرف (ID) *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  placeholder="مثال: desserts"
                  pattern="[a-z0-9_-]+"
                  title="استخدم أحرف إنجليزية صغيرة وأرقام وشرطات فقط"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  استخدم أحرف إنجليزية صغيرة فقط (مثال: trays, desserts, drinks)
                </p>
              </div>
            )}

            {/* Name */}
            <div className={editingId ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم التصنيف *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                placeholder="مثال: الحلويات"
                required
              />
            </div>

            {/* Image */}
            <div className={editingId ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط الصورة *
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                placeholder="/images/category.svg أو https://..."
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              {editingId ? 'تحديث' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Add Button */}
      {!showAddForm && !editingId && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-lg"
        >
          + إضافة تصنيف جديد
        </button>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-brand-primary transition">
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{category.name}</h4>
                  <p className="text-xs text-gray-500">ID: {category.id}</p>
                </div>
                <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {category.items.length} منتج
                </span>
              </div>
            </div>

            <div className="p-4">
              {/* Image Preview */}
              <div className="mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.svg'
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  disabled={category.items.length > 0}
                  title={category.items.length > 0 ? 'احذف المنتجات أولاً' : 'حذف التصنيف'}
                >
                  حذف
                </button>
              </div>

              {category.items.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  ⚠️ احذف المنتجات أولاً لحذف التصنيف
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          لا توجد تصنيفات. ابدأ بإضافة تصنيف جديد!
        </div>
      )}
    </div>
  )
}
