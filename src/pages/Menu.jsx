import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { currency, restaurantName } from '../data/menu'
import { useAdmin } from '../contexts/AdminContext'
import SmartImage from '../components/SmartImage'
import RotatingImage from '../components/RotatingImage'

export default function Menu() {
  const { categories } = useAdmin()
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id)

  // Update selected category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
    }
  }, [categories, selectedCategory])

  const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0]

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Helmet>
        <title>المنيو الكامل - {restaurantName} | أسعار وصور الأطباق</title>
        <meta name="description" content={`تصفح منيو ${restaurantName} الكامل مع الأسعار والصور - صواني فاخرة، طيور مشوية ومحمرة، محاشي متنوعة، وأطباق طبيخ بيتي شهية بالسمنة البلدي. احجز الآن!`} />
        <meta name="keywords" content="منيو مطعم ماسة, أسعار, صواني أفراح, ديك رومي, حمام, فراخ, محاشي ورق عنب, محشي كرنب, ملوخية, بامية, كفتة رز, عشا العروسة, كبسة" />
        
        {/* Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": typeof window !== 'undefined' ? window.location.origin : ''
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "المنيو",
                "item": typeof window !== 'undefined' ? window.location.href : '/menu'
              }
            ]
          })}
        </script>
        
        {/* Menu structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Menu",
            "name": `منيو ${restaurantName}`,
            "description": "منيو كامل للأطباق المصرية",
            "hasMenuSection": categories.map(cat => ({
              "@type": "MenuSection",
              "name": cat.name,
              "hasMenuItem": cat.items.map(item => ({
                "@type": "MenuItem",
                "name": item.name,
                "description": item.desc || cat.name,
                "image": item.image || item.images?.[0],
                "offers": item.price ? {
                  "@type": "Offer",
                  "price": item.price,
                  "priceCurrency": "EGP"
                } : undefined
              }))
            }))
          })}
        </script>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">المنيو</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* القائمة الجانبية */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-6">
            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap
                    ${selectedCategory === cat.id
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
                    }
                  `}
                >
                  <span className="text-2xl">{getCategoryIcon(cat.id)}</span>
                  <div className="text-right">
                    <div className="font-semibold">{cat.name}</div>
                    <div className={`text-xs ${selectedCategory === cat.id ? 'text-amber-100' : 'text-gray-500'}`}>
                      {cat.items.length} عنصر
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* منطقة عرض المنتجات */}
        <div className="flex-1">
          {!currentCategory ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg">جاري التحميل...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">{currentCategory.name}</h2>
                <p className="text-gray-600">{currentCategory.items.length} منتج متوفر</p>
              </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentCategory.items.map((item, idx) => (
              <article 
                key={idx} 
                className="rounded-xl border border-amber-100 bg-white shadow-sm hover:shadow-md overflow-hidden transition-shadow"
                itemScope 
                itemType="https://schema.org/MenuItem"
              >
                {item.images ? (
                  <RotatingImage
                    images={item.images}
                    alt={`${item.name} - ${currentCategory.name} من مطعم ماسة`}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                    interval={5000}
                  />
                ) : (
                  <SmartImage
                    itemName={item.name}
                    itemImage={item.image}
                    categoryImage={currentCategory.image}
                    alt={`${item.name} - ${currentCategory.name} من مطعم ماسة`}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800" itemProp="name">{item.name}</h3>
                      {item.desc ? <p className="text-sm text-gray-600 mt-1 whitespace-pre-line" itemProp="description">{item.desc}</p> : null}
                    </div>
                    {item.price ? (
                      <div className="text-left" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="priceCurrency" content="EGP" />
                        <div className="text-lg font-bold text-gray-900">
                          <span itemProp="price">{item.price}</span> {currency}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function getCategoryIcon(categoryId) {
  const icons = {
    trays: '🍽️',
    poultry: '🍗',
    mahshi: '🌿',
    homecooking: '🍲',
    others: '🍚'
  }
  return icons[categoryId] || '📋'
}
