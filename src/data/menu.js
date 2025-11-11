export const restaurantName = 'مطعم ماسة'
export const tagline = 'اكلنا كله بالسمنه البلدى بفضل الله والنظافه رأس مالنا'
export const phone = '+201113020419'
export const email = 'Mrwh75750@gmail.com'
export const facebook = 'https://www.facebook.com/people/%D9%85%D8%B7%D8%A8%D8%AE-%D9%85%D8%A7%D8%B3%D9%87-%D9%85%D8%B7%D8%B9%D9%85-%D8%A8%D9%8A%D8%AA%D9%8A/100064267953638/?rdid=Jh8VEjhyhjgrxycu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19u5MDbtBV%2F'
export const whatsappLink = `https://wa.me/201113020419?text=${encodeURIComponent('السلام عليكم، أريد الطلب من مطعم ماسة')}`
export const currency = 'ج.م'

// صور عامة (محلية من مجلد public)
export const heroImage = 'https://files.catbox.moe/g9u9my.jpg'
export const placeholderImage = '/images/placeholder.svg'

export const categories = [
  {
    id: 'trays',
    name: 'صواني',
    image: '/images/trays.svg',
    items: [
      { name: 'كبسه بالديك الرومي تكفي 10 أفراد مع سلطة الدقوس وسلطة زبادي', price: 1100, image: 'https://files.catbox.moe/0k3byw.jpg' },
      { name: 'باكدج 1100: بطه جامبو، نص ممبار، نص كفته، كيلو رز بسمتي، بطاطس محمرة', price: 1100, image: 'https://files.catbox.moe/kx3u4p.jpg' },
      { name: 'الصينية: فرختين محمرين، 3 كيلو محشي مشكل، 3 ملوخية', price: 1250, image: 'https://files.catbox.moe/tx2ipz.png' },
      { name: 'جوزين حمام جامبو، كيلو كفتة رز، كيلو رز بسمتي', price: 1450, image: 'https://files.catbox.moe/j6syad.jpg' },
      { name: 'ديك رومي ~8 كيلو مع رز بسمتي', price: 1500, image: 'https://files.catbox.moe/l9jk9k.jpg' },
      { name: 'فرخة مشوية، 2 كيلو محشي مشكل، بطاطس محمرة', price: 600, image: 'https://files.catbox.moe/dpemo3.jpg' },
      { name: '3 كيلو محشي مشكل وفرخة محمرة', price: 720, image: 'https://files.catbox.moe/q4ulel.jpg' },
      { name: 'فرخة محمرة، كيلو ورق عنب، كيلو كرنب، نص ممبار', price: 750, image: 'https://files.catbox.moe/xuamxp.jpg' },
      { name: 'جوز حمام كداب، جوز حمام جامبو، كيلو رز بسمتي، طاجن رز معمر', price: 800, image: 'https://files.catbox.moe/fty43a.jpg' },
      { name: 'دكر بط محشي ورق عنب، كيلو ونص محشي', price: 850, image: 'https://files.catbox.moe/eytnuw.jpg' },
      { name: 'جوزين حمام مع رز بسمتي', price: 860, image: 'https://files.catbox.moe/tpjv0q.jpg' },
      { name: 'جوزين حمام جامبو و2 كيلو محشي ورق عنب', price: 920, image: 'https://files.catbox.moe/cjxcsf.png' },
      { name: 'صينية جلاش باللحمة البلدي', price: 300, image: 'https://files.catbox.moe/yrpjlq.jpg' },
      { name: 'صينية رقاق باللحمة البلدي', price: 300, image: 'https://files.catbox.moe/r45x0e.jpg' },
      { name: 'صينية مكرونة بالبشاميل', price: 300, image: 'https://files.catbox.moe/7l2mws.jpg' },
      { name: 'عشا العروسة: بطه 3.5 ك، فرخة مشوية، 4 حمام، نص كباب، نص كفتة، نص ممبار، كيلو رز بسمتي', price: 2600, image: 'https://files.catbox.moe/g9u9my.jpg' },
      { name: 'فرخة مشوية مع بصل وبطاطس', price: 360, image: 'https://files.catbox.moe/jauf3l.jpg' },
    ],
  },
  {
    id: 'poultry',
    name: 'طيور',
    image: '/images/poultry.svg',
    items: [
      { name: 'حمام كداب (الوحدة)', price: 90, image: 'https://files.catbox.moe/qjbjhg.jpg' },
      { name: 'فردة حمام جامبو', price: 165, image: 'https://files.catbox.moe/zbna4c.jpg' },
    ],
  },
  {
    id: 'mahshi',
    name: 'محاشي',
    image: '/images/mahshi.svg',
    items: [
      { name: 'كيلو ممبار محمر', price: 290, image: 'https://files.catbox.moe/l3poiq.jpg' },
      { name: 'محشي كرنب (الكيلو)', price: 120, image: 'https://files.catbox.moe/5ecsgq.jpg' },
      { name: 'محشي مشكل (الكيلو)', price: 120, image: 'https://files.catbox.moe/neagwc.jpg' },
      { name: 'محشي ورق عنب (الكيلو)', price: 130, image: 'https://files.catbox.moe/aniu4p.jpg' },
    ],
  },
  {
    id: 'homecooking',
    name: 'طبيخ',
    image: '/images/homecooking.svg',
    items: [
      { name: 'صينية بطاطس كبيرة بدون لحوم', price: 190, image: 'https://files.catbox.moe/jmuy4a.jpg' },
      { name: 'علبة ملوخية/بامية/ويكا/خضار', price: 60, images: ['https://files.catbox.moe/jzbatt.jpg', 'https://files.catbox.moe/dspgtj.jpg'] },
      { name: 'كيلو كفتة رز متصبعة', price: 300, image: 'https://files.catbox.moe/a6kh9e.jpg' },
    ],
  },
  {
    id: 'others',
    name: 'أخرى',
    image: '/images/others.svg',
    items: [
      { name: 'طاجن رز معمر بالسمنة البلدي', price: 100, image: 'https://files.catbox.moe/21st1a.jpg' },
    ],
  },
]
