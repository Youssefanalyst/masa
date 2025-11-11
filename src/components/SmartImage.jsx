import { useMemo, useState } from 'react'
import { placeholderImage } from '../data/menu'

function slugify(name) {
  return name
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-') // أي شيء غير حرف/رقم يصبح شرطة
    .replace(/-+/g, '-') // دمج الشرطات المتتالية
    .replace(/^-+|-+$/g, '') // إزالة الشرطات من البداية/النهاية
    .toLowerCase()
}

export default function SmartImage({ itemName, itemImage, categoryImage, className = '', alt = '', onlyProduct = false }) {
  const slug = useMemo(() => slugify(itemName), [itemName])
  const candidates = useMemo(() => {
    const arr = []
    if (itemImage) arr.push(itemImage)
    arr.push(
      `/images/products/${slug}.webp`,
      `/images/products/${slug}.jpg`,
      `/images/products/${slug}.jpeg`,
      `/images/products/${slug}.png`,
      `/images/products/${slug}.svg`,
    )
    return arr
  }, [slug, itemImage])

  const [index, setIndex] = useState(0)
  const usingCandidate = index < candidates.length
  const src = usingCandidate ? candidates[index] : (categoryImage || placeholderImage)

  if (!usingCandidate && onlyProduct) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt || itemName}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        if (index < candidates.length) {
          setIndex((i) => i + 1)
        } else {
          e.currentTarget.onerror = null
          e.currentTarget.src = categoryImage || placeholderImage
        }
      }}
    />
  )
}
