export const restaurantName = 'مطبخ ماسة'
export const tagline = '✨معانا حتدووق طعم النظافه ✨'
export const phone = '+201113020419'
export const email = 'Mrwh75750@gmail.com'
export const facebook = 'https://www.facebook.com/people/%D9%85%D8%B7%D8%A8%D8%AE-%D9%85%D8%A7%D8%B3%D9%87-%D9%85%D8%B7%D8%B9%D9%85-%D8%A8%D9%8A%D8%AA%D9%8A/100064267953638/?rdid=Jh8VEjhyhjgrxycu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19u5MDbtBV%2F'
export const whatsappLink = `https://wa.me/201113020419?text=${encodeURIComponent('السلام عليكم، أريد الطلب من مطبخ ماسة')}`
export const currency = 'ج.م'

// صور عامة (محلية من مجلد public)
export const heroImage = '/images/products/عشا-العروسه-2600-بطه-3كيلو-ونص-فرخه-مشويه-جوزين-حمام-4-نص-كباب-نص-كفته-نص-ممبار-كيلو-رز-بسمتي.jpg'
export const placeholderImage = '/images/placeholder.svg'

export const categories = [
  {
    id: 'trays',
    name: 'صواني',
    image: '/images/trays.svg',
    items: [
      { name: 'كبسه بالديك الرومي تكفي 10 أفراد مع سلطة الدقوس وسلطة زبادي', price: 1100, image: '/images/products/1100-كبسه-بالديك-الرومى-تكفى-10افراد-مع-سلطة-الدقوس-وسلطة-زبادى.jpg' },
      { name: 'باكدج 1100: بطه جامبو، نص ممبار، نص كفته، كيلو رز بسمتي، بطاطس محمرة', price: 1100, image: '/images/products/1100بطه-جامبو-نص-ممبار-نص-كفته-كيلو-رز-بسمتي-بطاطس-محمره.jpg' },
      { name: 'الصينية: فرختين محمرين، 3 كيلو محشي مشكل، 3 ملوخية', price: 1250, image: '/images/products/1250-الصنيه-فرختين-محمرين-3كيلو-محشى-مشكل-3ملوخيه.png' },
      { name: 'جوزين حمام جامبو، كيلو كفتة رز، كيلو رز بسمتي', price: 1450, image: '/images/products/1450-جوزين-حمام-جامبو-كيلو-كفته-رز-كيلو-رز-بسمتي.jpg' },
      { name: 'ديك رومي ~8 كيلو مع رز بسمتي', price: 1500, image: '/images/products/1500-ديك-رومي-8كيلو-تقريبا-مع-رز-بسمتى.jpg' },
      { name: 'فرخة مشوية، 2 كيلو محشي مشكل، بطاطس محمرة', price: 600, image: '/images/products/600-فرخه-مشويه-2كيلو-محشى-مشكل-وبطاطس-محمره.jpg' },
      { name: '3 كيلو محشي مشكل وفرخة محمرة', price: 720, image: '/images/products/720-3كيلو-محشى-مشكل-وفرخة-محمره.jpg' },
      { name: 'فرخة محمرة، كيلو ورق عنب، كيلو كرنب، نص ممبار', price: 750, image: '/images/products/750-فرخه-محمره-كيلو-ورق-عنب-كيلو-كرنب-نص-ممبار.jpg' },
      { name: 'جوز حمام كداب، جوز حمام جامبو، كيلو رز بسمتي، طاجن رز معمر', price: 800, image: '/images/products/800-جوز-حمام-كداب-جوز-حمام-جامبو-كيلو-رز-بسمتي-طاجن-رز-معمر.jpg' },
      { name: 'دكر بط محشي ورق عنب، كيلو ونص محشي', price: 850, image: '/images/products/850-دكر-بط-محشى-ورق-عنب-كيلو-ونص-محشى.jpg' },
      { name: 'جوزين حمام مع رز بسمتي', price: 860, image: '/images/products/860-جوزين-حمام-مع-رز-بسمتي.jpg' },
      { name: 'جوزين حمام جامبو و2 كيلو محشي ورق عنب', price: 920, image: '/images/products/920-جوزين-حمام-جامبو-2كيلو-محشى-ورق-عنب.png' },
      { name: 'عشا العروسة: بطه 3.5 ك، فرخة مشوية، 4 حمام، نص كباب، نص كفتة، نص ممبار، كيلو رز بسمتي', price: 2600, image: '/images/products/عشا-العروسه-2600-بطه-3كيلو-ونص-فرخه-مشويه-جوزين-حمام-4-نص-كباب-نص-كفته-نص-ممبار-كيلو-رز-بسمتي.jpg' },
    ],
  },
  {
    id: 'varied',
    name: 'أصناف متنوعة',
    image: '/images/varied.svg',
    items: [
      // طيور
      { name: 'حمام كداب (الوحدة)', price: 90, image: '/images/products/حمام-كداب-الواحده-ب-90.jpg' },
      { name: 'فردة حمام جامبو', price: 165, image: '/images/products/فردة-حمام-جامبو-165.jpg' },
      // محاشي
      { name: 'محشي ورق عنب (الكيلو)', price: 130, image: '/images/products/محشى-ورق-العنب-130.jpg' },
      { name: 'محشي كرنب (الكيلو)', price: 120, image: '/images/products/محشى-كرنب-120.jpg' },
      { name: 'محشي مشكل (الكيلو)', price: 120, image: '/images/products/محشى-مشكل-120.jpg' },
      { name: 'كيلو ممبار محمر', price: 290, image: '/images/products/كيلو-ممبار-محمر-290.jpg' },
      // طبيخ
      { name: 'علبة ملوخية/بامية/ويكا/خضار', price: 60, image: '/images/products/علبة-ملوخيه-باميه-ويكا-خضار-60ج.jpg' },
      { name: 'طاجن رز معمر بالسمنة البلدي', price: 100, image: '/images/products/طاجن-رز-معمر-بالسمنه-البلدى-100.jpg' },
      { name: 'صينية بطاطس كبيرة بدون لحوم', price: 190, image: '/images/products/صنية-بطاطس-كبيره-بدون-لحوم-190.jpg' },
      { name: 'كيلو كفتة رز متصبعة', price: 300, image: '/images/products/كيلو-كفتة-رز-متصبعه-300.jpg' },
      // صواني معجنات
      { name: 'صينية جلاش باللحمة البلدي', price: 300, image: '/images/products/صنية-جلاش-باللحمه-البلدى-300.jpg' },
      { name: 'صينية رقاق باللحمة البلدي', price: 300, image: '/images/products/صنية-رقاق-باللحمه-البلدى-300.jpg' },
      { name: 'صينية مكرونة بالبشاميل', price: 300, image: '/images/products/صنية-مكرونه-بالبشاميل-300.jpg' },
      { name: 'فرخة مشوية مع بصل وبطاطس', price: 360, image: '/images/products/فرخه-مشويه-مع-بصل-وبطاطس360.jpg' },
    ],
  },
]
