'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import AboutSection from '@/components/AboutSection'
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
      <AboutSection />
      <Contact />
      <Footer />
    </main>
  )
}

