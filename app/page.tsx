'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import AboutSection from '@/components/AboutSection'
import Testimonials from '@/components/Testimonials'
import Products from '@/components/Products'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { trackPageView, startTimeTracking, trackScrollDepth, trackSectionView } from '@/lib/analytics'

export default function Home() {
  useEffect(() => {
    trackPageView()
    startTimeTracking()
    trackScrollDepth()

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.getAttribute('data-section')
          if (sectionId) {
            trackSectionView(sectionId)
          }
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('section[id], [data-section]')
    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0D1118]">
      <Header />
      <Hero />
      <Features />
      <Products />
      
      <div className="relative bg-white">

        <div className="absolute inset-0 pointer-events-none z-[5]">
          <Image
            src="/about-pattern.webp"
            alt="Pattern de gelo"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover opacity-30"
            unoptimized={false}
            priority={false}
          />
        </div>

        <div className="absolute top-0 left-0 w-full pointer-events-none z-[20]" style={{ zIndex: 20 }}>
          <div className="custom-shape-divider-top-1762751137">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className="shape-fill" />
            </svg>
          </div>
        </div>

        <div className="relative z-[10]">
          <AboutSection />
          <Testimonials />
        </div>
      </div>
      
      <Contact />
      <Footer />
    </main>
  )
}

