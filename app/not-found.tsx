'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  const sectionRef = useRef<HTMLElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!numberRef.current || !titleRef.current || !subtitleRef.current || !buttonsRef.current) return

      gsap.set(numberRef.current, { opacity: 0, scale: 0.5, rotation: -180 })
      gsap.set(titleRef.current, { opacity: 0, y: 30 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
      gsap.set(buttonsRef.current, { opacity: 0, y: 20 })

      const tl = gsap.timeline()

      tl.to(numberRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'back.out(2)',
      })

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')

      tl.to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0D1118] flex flex-col">
      <Header />
      
      <main ref={sectionRef} className="flex-1 relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 bg-[#0D1118] z-0 pointer-events-none" />
        
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/404-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.03,
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary-lightest rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] animate-float" style={{ animationDelay: '2s' }} />
        </div>


        <div className="container mx-auto px-4 relative z-10 text-center">
          <div
            ref={numberRef}
            className="text-9xl md:text-[12rem] lg:text-[15rem] font-extrabold mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.3) 0%, rgba(153, 226, 242, 0.2) 50%, rgba(48, 169, 217, 0.3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(48, 169, 217, 0.3))',
            }}
          >
            404
          </div>

          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-white">Página </span>
            <span className="text-gradient">não encontrada</span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-base md:text-lg text-primary-lightest/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Parece que passou uma avalanche por aqui! A página que você está procurando não existe ou foi soterrada pela neve.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="button-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Voltar ao Início</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="button-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Voltar</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

