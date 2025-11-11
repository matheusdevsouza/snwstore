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

export default function Home() {
  useEffect(() => {

  }, [])

  return (
    <main className="min-h-screen bg-[#0D1118]">
      <Header />
      <Hero />
      <Features />
      <Products />
      
      <div className="relative">

        <div className="absolute inset-0 pointer-events-none z-[15]">
          <Image
            src="/about-pattern.webp"
            alt="Pattern de gelo"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover opacity-30"
            style={{ mixBlendMode: 'overlay' }}
            unoptimized={false}
          />
        </div>
        
        <AboutSection />
        <Testimonials />
      </div>
      
      <Contact />
      <Footer />
    </main>
  )
}

