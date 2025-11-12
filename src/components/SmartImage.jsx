import { useState } from 'react'
import { placeholderImage } from '../data/menu'
import { resolveAssetUrl } from '../lib/assets'

export default function SmartImage({ itemName, itemImage, categoryImage, className = '', alt = '', onlyProduct = false }) {
  const [imgError, setImgError] = useState(false)
  
  const chosen = imgError 
    ? (onlyProduct ? null : (placeholderImage || categoryImage))
    : (itemImage || placeholderImage || categoryImage)
  const src = chosen ? resolveAssetUrl(chosen) : null

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
