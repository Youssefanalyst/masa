import { Helmet } from 'react-helmet-async'
import { phone, email, facebook, whatsappLink, restaurantName } from '../data/menu'

export default function Contact() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>تواصل معنا - {restaurantName}</title>
        <meta name="description" content={`تواصل مع ${restaurantName} - اتصل بنا على ${phone} أو عبر واتساب للطلبات والاستفسارات. نخدمك بكل سرور!`} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">تواصل معنا</h1>
      <ul className="space-y-4 text-lg">
        <li><a className="text-brand-primary hover:underline" href={`tel:${phone}`}>اتصال: {phone}</a></li>
        <li><a className="text-brand-primary hover:underline" href={whatsappLink} target="_blank" rel="noreferrer">واتساب</a></li>
        <li><a className="text-brand-primary hover:underline" href={`mailto:${email}`}>البريد: {email}</a></li>
        <li><a className="text-brand-primary hover:underline" href={facebook} target="_blank" rel="noreferrer">فيسبوك</a></li>
      </ul>
    </main>
  )
}
