'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setLenis(null)
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    setLenis(lenis)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    ScrollTrigger.refresh()

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      setLenis(null)
    }
  }, [isMobile])

  return <>{children}</>
}
