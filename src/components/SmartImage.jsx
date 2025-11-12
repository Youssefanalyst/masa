import { useState } from 'react'
import { placeholderImage } from '../data/menu'

export default function SmartImage({ itemName, itemImage, categoryImage, className = '', alt = '', onlyProduct = false }) {
  const [imgError, setImgError] = useState(false)
  
  // Use itemImage (CDN) directly, fallback to placeholder first (then category)
  const src = imgError 
    ? (onlyProduct ? null : (placeholderImage || categoryImage))
    : (itemImage || placeholderImage || categoryImage)

  if (!src) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt || itemName}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        setImgError(true)
      }}
    />
  )
}
