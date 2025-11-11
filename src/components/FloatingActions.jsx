import { Phone, MessageCircle, Facebook } from 'lucide-react'
import { phone, whatsappLink, facebook } from '../data/menu'

export default function FloatingActions() {
  return (
    <div className="fixed left-4 bottom-4 flex flex-col gap-3">
      <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2 shadow-lg hover:bg-green-700">
        <MessageCircle size={18} />
        <span>واتساب</span>
      </a>
      <a href={`tel:${phone}`} className="flex items-center gap-2 rounded-full bg-brand-primary text-white px-4 py-2 shadow-lg hover:bg-amber-700">
        <Phone size={18} />
        <span>اتصال</span>
      </a>
      <a href={facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg hover:bg-blue-700">
        <Facebook size={18} />
        <span>فيسبوك</span>
      </a>
    </div>
  )
}
