# 🔧 حل المشاكل الشائعة - Troubleshooting

## ❌ المشكلة: الموقع بيقع عند عمل Refresh

### الأعراض:
- الموقع يشتغل عادي لما تفتحه أول مرة
- لما تضغط F5 (Refresh) على أي صفحة غير الرئيسية (مثل `/menu` أو `/admin/dashboard`)
- الموقع بيظهر خطأ 404 أو صفحة فاضية

### السبب:
في تطبيقات React SPA مع React Router، الـ routes كلها client-side (في المتصفح فقط):
```
/ → Home.jsx
/menu → Menu.jsx
/admin/dashboard → Dashboard.jsx
```

عند عمل refresh، المتصفح بيطلب من السيرفر (Vite) ملف `/menu` أو `/admin/dashboard` الحقيقي، لكنهم مش موجودين فعلياً على السيرفر!

### ✅ الحل:
تم إضافة `historyApiFallback: true` في `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,  // ✅
  },
  preview: {
    historyApiFallback: true,  // ✅
  }
})
```

هذا يخلي Vite يرجع `index.html` على أي route، وبعدين React Router ياخد الموضوع ويروح للصفحة الصحيحة.

### خطوات التطبيق:
1. ✅ تم التعديل تلقائياً في `vite.config.js`
2. أوقف السيرفر (Ctrl+C)
3. شغّل من جديد:
```bash
npm run dev
```
4. جرب الـ refresh الآن - المفروض يشتغل! 🎉

---

## 🔄 للإنتاج (Production)

عند رفع الموقع على سيرفر حقيقي، تأكد من:

### Netlify:
الملف `public/_redirects` موجود بالفعل:
```
/*    /index.html   200
```
✅ جاهز!

### Apache:
الملف `public/.htaccess` موجود بالفعل:
```apache
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
✅ جاهز!

### Nginx:
أضف في `/etc/nginx/sites-available/your-site`:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 🐛 مشاكل أخرى شائعة

### المشكلة: صفحة المنيو فاضية بعد الـ Refresh
**الأعراض:**
- لما تعمل refresh على `/menu`، الصفحة تظهر فاضية أو "جاري التحميل..."
- التصنيفات مش ظاهرة

**السبب:**
البيانات بتتحمل من localStorage في `useEffect` في AdminContext، فبياخد وقت صغير (milliseconds). الـ state `selectedCategory` كان بيبقى undefined.

**الحل المطبق:**
تم إضافة `useEffect` في صفحة المنيو:
```javascript
useEffect(() => {
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].id)
  }
}, [categories, selectedCategory])
```

وتم إضافة loading state:
```javascript
{!currentCategory ? (
  <div className="text-center py-20">
    <div className="text-gray-400 text-lg">جاري التحميل...</div>
  </div>
) : (
  // المحتوى العادي
)}
```

✅ **محلول!**

---

### المشكلة: البيانات مش ظاهرة في المنيو
**الحل:** تأكد إنك بتستخدم `useAdmin()` مش import مباشر:
```javascript
// ❌ خطأ
import { categories } from '../data/menu'

// ✅ صح
import { useAdmin } from '../contexts/AdminContext'
const { categories } = useAdmin()
```

### المشكلة: التعديلات في Admin مش ظاهرة في الموقع
**الحل:** تأكد إن AdminProvider موجود في `main.jsx`:
```javascript
<AdminProvider>
  <App />
</AdminProvider>
```
✅ موجود بالفعل!

### المشكلة: نسيت كلمة مرور Admin
**الحل:** 
1. افتح DevTools (F12)
2. Application → Local Storage
3. احذف `adminToken`
4. كلمة المرور الافتراضية: `masa2025`

### المشكلة: حذفت بيانات بالخطأ
**الحل:**
1. ادخل لوحة التحكم
2. اضغط زر **إعادة تعيين**
3. أو من DevTools: احذف `menuCategories` من localStorage

---

## 📞 دعم إضافي

إذا استمرت المشكلة:
1. امسح cache المتصفح (Ctrl+Shift+Delete)
2. امسح localStorage كامل من DevTools
3. أوقف وشغل السيرفر من جديد
4. تأكد من تثبيت dependencies:
```bash
npm install
```

✅ **المشكلة محلولة!**
