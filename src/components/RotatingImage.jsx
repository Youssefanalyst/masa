import { useState, useEffect } from 'react'
import { resolveAssetUrl } from '../lib/assets'

export default function RotatingImage({ 
  images = [], 
  alt = 'صورة المنتج', 
  className = '', 
  interval = 5000,
  ...props 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Resolve all image URLs and preload them
  useEffect(() => {
    if (!Array.isArray(images) || images.length === 0) return
    
    // Filter out invalid images and resolve URLs
    const validImages = images.filter(img => img).map(img => ({
      original: img,
      resolved: resolveAssetUrl(img)
    }))
    
    if (validImages.length === 0) return
    
    // Check which images are actually loadable
    const checkImages = async () => {
      const loadableImages = []
      
      for (const img of validImages) {
        try {
          const exists = await checkImageExists(img.resolved)
          if (exists) {
            loadableImages.push(img)
          }
        } catch (error) {
          console.warn(`Failed to load image: ${img.original}`, error)
        }
      }
      
      setLoadedImages(loadableImages)
      setIsLoading(false)
    }
    
    checkImages()
  }, [images])
  
  // Set up rotation interval if we have multiple images
  useEffect(() => {
    if (loadedImages.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % loadedImages.length)
    }, interval)
    
    return () => clearInterval(timer)
  }, [loadedImages, interval])
  
  // Check if an image exists by trying to load it
  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(false)
      
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  // If no images are available, return null
  if (isLoading || loadedImages.length === 0) {
    return null
  }
  
  const currentImage = loadedImages[currentIndex] || loadedImages[0]
  if (!currentImage) return null

  return (
    <img
      src={currentImage.resolved}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        // If the current image fails to load, try the next one
        console.warn(`Failed to load image: ${currentImage.original}`)
        setCurrentIndex(prev => (prev + 1) % loadedImages.length)
      }}
      {...props}
    />
  )
}
