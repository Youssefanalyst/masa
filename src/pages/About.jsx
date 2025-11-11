import { Helmet } from 'react-helmet-async'
import { restaurantName, tagline } from '../data/menu'

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>من نحن - {restaurantName}</title>
        <meta name="description" content={`تعرف على ${restaurantName} - ${tagline}. مطعم يقدم أكل بيتي أصيل مع خدمة تجهيز الولائم والمناسبات.`} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">من نحن</h1>
      <p className="text-gray-700 leading-8">
        مطعم ماسة يقدم أكل بيتي أصيل بالسمنة البلدي، بجودة عالية ونظافة هي رأس مالنا.
        نجهز الولائم والطلبات الخاصة حسب رغبتكم، مع التنوع في الصواني، المحاشي، الطيور والطبيخ.
      </p>
    </main>
  )
}
