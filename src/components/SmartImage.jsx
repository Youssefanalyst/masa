import { useState, useEffect } from 'react'
import { placeholderImage } from '../data/menu'
import { resolveAssetUrl } from '../lib/assets'

export default function SmartImage({ 
  itemName, 
  itemImage, 
  categoryImage, 
  className = '', 
  alt = '', 
  onlyProduct = false,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState('')
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    // Reset error state when image changes
    setHasError(false)
    
    // Determine which image to show
    let imageToShow = itemImage
    
    if (hasError) {
      if (onlyProduct) {
        imageToShow = placeholderImage || categoryImage
      } else {
        imageToShow = placeholderImage || categoryImage
      }
    }
    
    if (!imageToShow) {
      setImgSrc('')
      return
    }
    
    // Resolve the image URL
    const resolvedUrl = resolveAssetUrl(imageToShow)
    setImgSrc(resolvedUrl)
    
    // Preload the image to check if it exists
    if (resolvedUrl) {
      const img = new Image()
      img.src = resolvedUrl
      img.onload = () => {
        // Image loaded successfully
        setHasError(false)
        setImgSrc(resolvedUrl)
      }
      img.onerror = () => {
        // Image failed to load
        setHasError(true)
      }
    }
  }, [itemImage, categoryImage, hasError, onlyProduct])
  
  if (!imgSrc) {
    return null
  }

  return (
    <img
      src={imgSrc}
      alt={alt || itemName || 'صورة المنتج'}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true)
        }
      }}
      {...props}
    />
  )
}
