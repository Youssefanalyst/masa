import { useState, useEffect } from 'react'

export default function RotatingImage({ images, alt, className, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images, interval])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <img
      src={images[currentIndex]}
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}
