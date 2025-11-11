import { useState, useEffect } from 'react'
import { useAdmin } from '../../contexts/AdminContext'

export default function ProductForm({ 
  selectedCategory, 
  onCategoryChange, 
  editingProduct = null, 
  onEditComplete = null 
}) {
  const { categories, addProduct, updateProduct } = useAdmin()
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    desc: '',
    image: '',
    images: ''
  })

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.product.name || '',
        price: editingProduct.product.price || '',
        desc: editingProduct.product.desc || '',
        image: editingProduct.product.image || '',
        images: editingProduct.product.images?.join('\n') || ''
      })
    }
  }, [editingProduct])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const categoryId = editingProduct?.categoryId || selectedCategory
    if (!categoryId) {
      alert('الرجاء اختيار تصنيف')
      return
    }

    const product = {
      name: formData.name,
      price: formData.price ? parseInt(formData.price) : undefined,
      desc: formData.desc || undefined,
      image: formData.image || undefined,
      images: formData.images ? formData.images.split('\n').filter(img => img.trim()) : undefined
    }

    // Remove undefined fields
    Object.keys(product).forEach(key => 
      product[key] === undefined && delete product[key]
    )

    if (editingProduct) {
      const success = await updateProduct(categoryId, editingProduct.index, product)
      if (onEditComplete) onEditComplete()
      if (success !== false) alert('تم تحديث المنتج بنجاح!')
    } else {
      const success = await addProduct(categoryId, product)
      if (success !== false) alert('تم إضافة المنتج بنجاح!')
    }

    // Reset form
    setFormData({
      name: '',
      price: '',
      desc: '',
      image: '',
      images: ''
    })
  }

  const handleCancel = () => {
    if (onEditComplete) onEditComplete()
    setFormData({
      name: '',
      price: '',
      desc: '',
      image: '',
      images: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Select */}
        {!editingProduct && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              التصنيف *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              required
            >
              <option value="">اختر تصنيف</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Product Name */}
        <div className={!editingProduct ? '' : 'md:col-span-2'}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اسم المنتج *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            placeholder="مثال: كبسة بالديك الرومي"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            السعر (ج.م)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            placeholder="مثال: 1100"
            min="0"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            رابط الصورة
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          الوصف
        </label>
        <textarea
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          rows="3"
          placeholder="وصف تفصيلي للمنتج (اختياري)"
        />
      </div>

      {/* Multiple Images */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          صور متعددة (للتبديل التلقائي)
        </label>
        <textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none font-mono text-sm"
          rows="4"
          placeholder="ضع كل رابط صورة في سطر منفصل&#10;https://...&#10;https://..."
        />
        <p className="text-xs text-gray-500 mt-1">
          إذا أضفت صور متعددة، سيتم تجاهل حقل "رابط الصورة" الواحدة
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-amber-700 transition"
        >
          {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  )
}
