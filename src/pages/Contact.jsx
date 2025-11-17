import { Helmet } from 'react-helmet-async'
import { phone, email, facebook, whatsappLink, restaurantName, heroImage } from '../data/menu'
import { resolveAssetUrl } from '../lib/assets'

export default function Contact() {
  const localPhoneMain = phone && phone.startsWith('+20') ? `0${phone.slice(3)}` : phone
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>تواصل معنا - {restaurantName}</title>
        <meta name="description" content={`تواصل مع ${restaurantName} - اتصل بنا على ${phone} أو عبر واتساب للطلبات والاستفسارات. نخدمك بكل سرور!`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/contact'} />
        <link rel="alternate" hrefLang="ar" href={typeof window !== 'undefined' ? window.location.href : '/contact'} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`تواصل معنا - ${restaurantName}`} />
        <meta property="og:description" content={`تواصل مع ${restaurantName} - اتصل بنا على ${phone} أو عبر واتساب للطلبات والاستفسارات.`} />
        <meta property="og:image" content={resolveAssetUrl(heroImage)} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`تواصل معنا - ${restaurantName}`} />
        <meta name="twitter:description" content={`تواصل مع ${restaurantName} - اتصل بنا على ${phone} أو عبر واتساب للطلبات والاستفسارات.`} />
        <meta name="twitter:image" content={resolveAssetUrl(heroImage)} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">تواصل معنا</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <span>اتصال: </span>
          <a className="text-brand-primary hover:underline" href={`tel:${phone}`}>{localPhoneMain}</a>
          <span className="mx-1"> - </span>
          <a className="text-brand-primary hover:underline" href={`tel:+201113020419`}>01113020419</a>
        </li>
        <li><a className="text-brand-primary hover:underline" href={whatsappLink} target="_blank" rel="noreferrer">واتساب</a></li>
        <li><a className="text-brand-primary hover:underline" href={`mailto:${email}`}>البريد: {email}</a></li>
        <li><a className="text-brand-primary hover:underline" href={facebook} target="_blank" rel="noreferrer">فيسبوك</a></li>
      </ul>
    </main>
  )
}
