'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Features from '@/components/Features'
import About from '@/components/About'
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
      <About />
      <Contact />
      <Footer />
    </main>
  )
}

