import { NavLink, Link } from 'react-router-dom'
import { restaurantName } from '../data/menu'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-primary flex items-center gap-2" aria-label="الرئيسية - مطعم ماسة">
          <span className="text-3xl">💎</span>
          {restaurantName}
        </Link>
        <nav className="flex items-center gap-6 text-lg" aria-label="القائمة الرئيسية">
          <NavLink to="/" end className={({isActive}) => (isActive ? 'text-brand-primary font-semibold' : 'text-gray-700 hover:text-brand-primary')} aria-label="الصفحة الرئيسية">الرئيسية</NavLink>
          <NavLink to="/menu" className={({isActive}) => (isActive ? 'text-brand-primary font-semibold' : 'text-gray-700 hover:text-brand-primary')} aria-label="المنيو الكامل">المنيو</NavLink>
          <NavLink to="/about" className={({isActive}) => (isActive ? 'text-brand-primary font-semibold' : 'text-gray-700 hover:text-brand-primary')} aria-label="معلومات عن المطعم">من نحن</NavLink>
          <NavLink to="/contact" className={({isActive}) => (isActive ? 'text-brand-primary font-semibold' : 'text-gray-700 hover:text-brand-primary')} aria-label="تواصل معنا">تواصل</NavLink>
        </nav>
      </div>
    </header>
  )
}
