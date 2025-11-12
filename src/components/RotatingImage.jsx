import { useState, useEffect } from 'react'
import { resolveAssetUrl } from '../lib/assets'

export default function RotatingImage({ images, alt, className, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const resolvedImages = (images || []).map(img => resolveAssetUrl(img))

  useEffect(() => {
    if (!resolvedImages || resolvedImages.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedImages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [resolvedImages, interval])

  if (!resolvedImages || resolvedImages.length === 0) {
    return null
  }

  return (
    <img
      src={resolvedImages[currentIndex]}
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}
