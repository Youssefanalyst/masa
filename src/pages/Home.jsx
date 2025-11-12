import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { restaurantName, tagline, whatsappLink, heroImage, placeholderImage, phone } from '../data/menu'
import { resolveAssetUrl } from '../lib/assets'
import { useAdmin } from '../contexts/AdminContext'
import RotatingImage from '../components/RotatingImage'

export default function Home() {
  const { categories } = useAdmin()
  return (
    <main>
      <Helmet>
        <title>{restaurantName} - طعم بيتي أصيل بالسمنة البلدي</title>
        <meta name="description" content={`${restaurantName} - ${tagline}. نقدم أشهى المأكولات المصرية من صواني، محاشي، طيور، وطبيخ بيتي بالسمنة البلدي. اطلب الآن عبر واتساب ${phone}`} />
        <meta name="keywords" content="مطعم, مطعم ماسة, أكل بيتي, سمنة بلدي, صواني, محاشي, طيور, ديك رومي, حمام, فراخ محمرة, طبيخ بيتي, مطاعم مصرية, كبسة, بطة محمرة, ممبار" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="restaurant" />
        <meta property="og:title" content={`${restaurantName} - طعم بيتي أصيل`} />
        <meta property="og:description" content={tagline} />
        <meta property="og:image" content={resolveAssetUrl(heroImage)} />
        <meta property="og:image:alt" content="عشا العروسة - ديك رومي، بطة، حمام من مطعم ماسة" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:locale" content="ar_EG" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${restaurantName} - طعم بيتي أصيل`} />
        <meta name="twitter:description" content={tagline} />
        <meta name="twitter:image" content={resolveAssetUrl(heroImage)} />
        <meta name="twitter:image:alt" content="عشا العروسة - ديك رومي، بطة، حمام من مطعم ماسة" />
        
        {/* Business Info */}
        <meta name="contact" content={phone} />
        <meta name="author" content={restaurantName} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": restaurantName,
            "description": tagline,
            "image": heroImage,
            "telephone": phone,
            "email": "Mrwh75750@gmail.com",
            "servesCuisine": "Egyptian",
            "priceRange": "$$",
            "menu": typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu',
            "url": typeof window !== 'undefined' ? window.location.origin : '',
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "EG",
              "addressLocality": "Egypt"
            }
          })}
        </script>
      </Helmet>
      <section className="bg-gradient-to-b from-amber-100 to-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-4">{restaurantName}</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">{tagline}</p>
          <div className="flex justify-center gap-4 mb-8">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700">اطلب واتساب</a>
            <Link to="/menu" className="px-6 py-3 rounded-full bg-brand-primary text-white hover:bg-amber-700">شاهد المنيو</Link>
          </div>
          <div className="max-w-4xl mx-auto">
            <img src={resolveAssetUrl(heroImage) || placeholderImage} alt="عشا العروسة - ديك رومي، بطة، حمام، وأطباق شهية من مطعم ماسة" loading="eager" className="w-full h-auto object-contain rounded-2xl shadow-lg border border-amber-100" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">التصنيفات</h2>
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            جاري تحميل التصنيفات...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => {
            // جمع صور المنتجات من التصنيف
            const productImages = cat.items
              .map(item => {
                if (item.images && item.images.length > 0) {
                  return item.images
                } else if (item.image) {
                  return [item.image]
                }
                return []
              })
              .flat()
              .filter(img => img && !img.includes('.svg'))

            return (
              <Link 
                key={cat.id} 
                to={`/menu#${cat.id}`} 
                className="block p-4 rounded-xl border border-amber-100 hover:border-amber-300 bg-white shadow-sm hover:shadow-md transition"
                aria-label={`عرض ${cat.name} - ${cat.items.length} منتج متوفر`}
              >
                {productImages.length > 0 ? (
                  <RotatingImage
                    images={productImages}
                    alt={`منتجات ${cat.name} - ${cat.items.map(i => i.name).slice(0, 3).join('، ')} من مطعم ماسة`}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg mb-3"
                    interval={5000}
                  />
                ) : (
                  <img
                    src={cat.image || placeholderImage}
                    alt={`تصنيف ${cat.name} - مطعم ماسة`}
                    loading="lazy"
                    width="400"
                    height="300"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = placeholderImage
                    }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{cat.name}</div>
                    <div className="text-sm text-gray-500">{cat.items.length} عنصر</div>
                  </div>
                  <div className="text-brand-primary text-2xl" aria-hidden="true">›</div>
                </div>
              </Link>
            )
          })}
        </div>
        )}
      </section>
    </main>
  )
}
