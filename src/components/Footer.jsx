import { Link } from 'react-router-dom'
import { phone, email, facebook, restaurantName, tagline } from '../data/menu'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-brand-primary mb-2">{restaurantName}</h3>
          <p className="text-sm mb-3">{tagline}</p>
          <nav aria-label="روابط سريعة">
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="hover:text-brand-primary hover:underline">الرئيسية</Link></li>
              <li><Link to="/menu" className="hover:text-brand-primary hover:underline">المنيو</Link></li>
              <li><Link to="/about" className="hover:text-brand-primary hover:underline">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary hover:underline">تواصل معنا</Link></li>
            </ul>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-2">تواصل معنا</h4>
          <ul className="space-y-1" itemScope itemType="https://schema.org/Restaurant">
            <li>
              <a className="hover:text-brand-primary hover:underline" href={`tel:${phone}`} itemProp="telephone" aria-label={`الاتصال على ${phone}`}>
                📞 اتصال: {phone}
              </a>
            </li>
            <li>
              <a className="hover:text-brand-primary hover:underline" href={`mailto:${email}`} itemProp="email" aria-label={`إرسال بريد إلى ${email}`}>
                ✉️ البريد: {email}
              </a>
            </li>
            <li>
              <a className="hover:text-brand-primary hover:underline" href={facebook} target="_blank" rel="noopener noreferrer" aria-label="تابعنا على فيسبوك">
                👍 فيسبوك
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-3">
            © {new Date().getFullYear()} {restaurantName}. جميع الحقوق محفوظة.
          </div>
          <div className="text-xs text-gray-400 mb-2">
            مطعم مصري متخصص في الأكل البيتي بالسمنة البلدي
          </div>
          <Link 
            to="/admin/login" 
            className="text-xs text-gray-400 hover:text-brand-primary hover:underline inline-block"
          >
            🔐 لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  )
}
