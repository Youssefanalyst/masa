# 💎 مطعم ماسة - Masa Restaurant

موقع إلكتروني متكامل لمطعم ماسة مع لوحة تحكم إدارية وربط Supabase

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green)

## 🌟 المميزات

### 🌐 الموقع الرئيسي
- ✅ تصميم عربي RTL كامل
- ✅ Responsive للموبايل والتابلت والديسكتوب
- ✅ صور متحركة (تبديل كل 5 ثواني)
- ✅ قائمة منيو تفاعلية بأقسام قابلة للتبديل
- ✅ FloatingActions (واتساب، هاتف، فيسبوك)

### 🔍 SEO محسّن
- ✅ React Helmet للـ meta tags
- ✅ JSON-LD structured data
- ✅ Sitemap.xml & Robots.txt
- ✅ Pre-rendering مع react-snap
- ✅ Microdata على المنتجات

### 🔐 Admin Panel
- ✅ لوحة تحكم كاملة
- ✅ CRUD كامل للمنتجات والتصنيفات
- ✅ Authentication محمي
- ✅ واجهة حديثة وسهلة

### 💾 قاعدة البيانات
- ✅ Supabase (PostgreSQL)
- ✅ Fallback تلقائي على localStorage
- ✅ Row Level Security (RLS)

## 🚀 البداية السريعة

### التثبيت:
```bash
npm install
```

### التشغيل:
```bash
npm run dev
```

### Admin Panel:
```
URL: http://localhost:5173/admin/login
Password: masa2025
```

## 📁 هيكل المشروع

```
masa-restaurant/
├── src/
│   ├── components/      # المكونات الرئيسية
│   ├── pages/          # الصفحات
│   ├── contexts/       # State Management
│   ├── lib/            # Supabase client
│   └── data/           # البيانات الأولية
├── public/             # الملفات الثابتة
├── scripts/            # Scripts مساعدة
└── supabase-schema.sql # Database schema
```

## 🔧 إعداد Supabase (اختياري)

1. أنشئ مشروع على [Supabase](https://supabase.com)
2. انسخ API keys إلى `.env`
3. شغّل `supabase-schema.sql`
4. استورد البيانات: `npm run import-supabase`

للتفاصيل: راجع `SUPABASE-SETUP.md`

## 📚 المستندات

- `QUICK-START.md` - دليل البداية السريعة
- `ADMIN-README.md` - شرح لوحة التحكم
- `SEO-README.md` - تحسينات SEO
- `SUPABASE-SETUP.md` - إعداد Supabase
- `TROUBLESHOOTING.md` - حل المشاكل

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 19 + Vite 6
- **Styling**: TailwindCSS 3
- **Routing**: React Router v6
- **SEO**: React Helmet Async
- **Database**: Supabase (PostgreSQL)
- **State**: Context API
- **Icons**: Lucide React

## 📞 معلومات المطعم

- **الاسم**: مطعم ماسة
- **الهاتف**: +201113020419
- **البريد**: Mrwh75750@gmail.com

## 📄 الرخصة

هذا المشروع مملوك لمطعم ماسة

## 👨‍💻 المطور

Youssef Analyst - [GitHub](https://github.com/Youssefanalyst)
