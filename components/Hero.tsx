'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faStar, faBox, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Model3D = dynamic(() => import('./Model3D'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const backgroundGlow1Ref = useRef<HTMLDivElement>(null)
  const backgroundGlow2Ref = useRef<HTMLDivElement>(null)
  const rotatingGlowRef = useRef<HTMLDivElement>(null)
  const rotatingGlow2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          statsRef.current ? Array.from(statsRef.current.children) : [],
          {
            y: 40,
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: 0.15,
          },
          '-=0.3'
        )
        .from(
          backgroundGlow1Ref.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: 1.5,
            ease: 'power2.out',
          },
          '-=1.0'
        )
        .from(
          backgroundGlow2Ref.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: 1.5,
            ease: 'power2.out',
          },
          '-=1.2'
        )
        
        .from(
          rotatingGlowRef.current,
          {
            opacity: 0,
            scale: 0.5,
            duration: 1.2,
            ease: 'power2.out',
          },
          '-=0.8'
        )
        .from(
          rotatingGlow2Ref.current,
          {
            opacity: 0,
            scale: 0.5,
            duration: 1.2,
            ease: 'power2.out',
          },
          '-=1.0'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])


  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 bg-[#0D1118] z-0 pointer-events-none" />
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.03,
        }}
      />
      
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div 
          ref={backgroundGlow1Ref}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] animate-float" 
        />
        <div 
          ref={backgroundGlow2Ref}
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary-lightest rounded-full mix-blend-multiply filter blur-3xl opacity-[0.03] animate-float" 
          style={{ animationDelay: '2s' }} 
        />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5%] md:right-[12%] md:translate-x-0 w-[350px] h-[350px] md:w-[500px] md:h-[500px]">
          <div 
            ref={rotatingGlowRef}
            className="w-full h-full animate-rotate-glow"
            style={{
              background: 'radial-gradient(circle, rgba(48, 169, 217, 0.05) 0%, rgba(153, 226, 242, 0.03) 30%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div 
            ref={rotatingGlow2Ref}
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(circle, rgba(153, 226, 242, 0.06) 0%, rgba(48, 169, 217, 0.04) 40%, transparent 70%)',
              filter: 'blur(80px)',
              animation: 'rotate-glow 25s linear infinite reverse',
            }}
          />
        </div>
      </div>

      <div className="hidden md:block absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-auto">
          <Model3D />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pointer-events-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left space-y-6 relative z-20 pointer-events-auto pt-8 md:pt-0">
            <h1
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl"
            >
              <span className="bg-gradient-to-r from-white via-primary-lightest to-primary-light bg-clip-text text-transparent">
                Os melhores produtos com
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-light via-primary-lightest to-white bg-clip-text text-transparent">
                os melhores preços
              </span>
              <br />
              <span className="text-white">do mercado</span>
            </h1>
            
            <p
              ref={subtitleRef}
              className="text-base md:text-lg lg:text-xl text-primary-lightest/80 max-w-2xl leading-relaxed font-light"
            >
              Revendas confiáveis no Mercado Livre com qualidade garantida e
              entrega rápida. Sua satisfação é nossa prioridade.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <a href="#products" className="button-primary text-lg px-8 py-4 flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faShoppingBag} />
                <span>Explorar Produtos</span>
              </a>
              <a href="#about" className="button-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faStar} />
                <span>Saber Mais</span>
              </a>
            </div>

            <div 
              ref={statsRef}
              className="flex flex-wrap gap-6 md:gap-8 justify-center md:justify-start pt-6 pb-12 md:pb-6 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent" />
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <FontAwesomeIcon icon={faBox} className="text-primary-light/70 text-xl md:text-2xl" />
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-light to-primary-lightest bg-clip-text text-transparent">
                    1000+
                  </div>
                </div>
                <div className="text-xs md:text-sm text-primary-lightest/60 font-medium uppercase tracking-wider">
                  Produtos
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <FontAwesomeIcon icon={faUserFriends} className="text-primary-light/70 text-xl md:text-2xl" />
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-light to-primary-lightest bg-clip-text text-transparent">
                    5000+
                  </div>
                </div>
                <div className="text-xs md:text-sm text-primary-lightest/60 font-medium uppercase tracking-wider">
                  Clientes Satisfeitos
                </div>
              </div>
            </div>

          </div>

          <div ref={logoRef} className="hidden md:flex flex-1 justify-center md:justify-end min-h-[500px] w-full md:w-auto pointer-events-none">
          </div>
        </div>
      </div>

      <div className="custom-shape-divider-bottom-1762731302">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className="shape-fill" />
        </svg>
      </div>

    </section>
  )
}

