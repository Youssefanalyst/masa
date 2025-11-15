import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>الصفحة غير موجودة</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/404'} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">الصفحة غير موجودة</h1>
      <p className="text-gray-600 mb-6">يبدو أنك وصلت إلى مسار غير موجود.</p>
      <Link to="/" className="px-6 py-3 rounded-full bg-brand-primary text-white hover:bg-amber-700">العودة للرئيسية</Link>
    </main>
  )
}
