import { Helmet } from 'react-helmet-async'
import { restaurantName, tagline, heroImage } from '../data/menu'
import { resolveAssetUrl } from '../lib/assets'

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>من نحن - {restaurantName}</title>
        <meta name="description" content={`تعرف على ${restaurantName} - ${tagline}. مطعم يقدم أكل بيتي أصيل مع خدمة تجهيز الولائم والمناسبات.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/about'} />
        <link rel="alternate" hrefLang="ar" href={typeof window !== 'undefined' ? window.location.href : '/about'} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`من نحن - ${restaurantName}`} />
        <meta property="og:description" content={`${restaurantName} - ${tagline}`} />
        <meta property="og:image" content={resolveAssetUrl(heroImage)} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`من نحن - ${restaurantName}`} />
        <meta name="twitter:description" content={`${restaurantName} - ${tagline}`} />
        <meta name="twitter:image" content={resolveAssetUrl(heroImage)} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">من نحن</h1>
      <p className="text-gray-700 leading-8">
        مطعم ماسة يقدم أكل بيتي أصيل بالسمنة البلدي، بجودة عالية ونظافة هي رأس مالنا.
        نجهز الولائم والطلبات الخاصة حسب رغبتكم، مع التنوع في الصواني، المحاشي، الطيور والطبيخ.
      </p>
    </main>
  )
}
