'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShippingFast,
  faShieldAlt,
  faHeadset,
  faMedal,
  faCreditCard,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons'

const features = [
  {
    icon: faShippingFast,
    title: 'Entrega Rápida',
    description: 'Entregas em todo o Brasil com rapidez e segurança',
  },
  {
    icon: faShieldAlt,
    title: 'Compra Segura',
    description: 'Proteção total nas suas compras com garantia de segurança',
  },
  {
    icon: faHeadset,
    title: 'Suporte 24/7',
    description: 'Atendimento dedicado para resolver suas dúvidas a qualquer hora',
  },
  {
    icon: faMedal,
    title: 'Produtos Originais',
    description: '100% originais com nota fiscal e garantia do fabricante',
  },
  {
    icon: faCreditCard,
    title: 'Pagamento Facilitado',
    description: 'Aceitamos todas as formas de pagamento com parcelamento',
  },
  {
    icon: faBoxOpen,
    title: 'Troca Fácil',
    description: 'Política de troca e devolução simples e descomplicada',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !cardsRef.current || !sectionRef.current) return

      const cards = Array.from(cardsRef.current.querySelectorAll('.feature-card')) as HTMLElement[]

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, { 
        opacity: 0, 
        scaleX: 0,
        transformOrigin: 'center center'
      })
      gsap.set(cards, { 
        opacity: 0, 
        y: 80,
        scale: 0.85
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline()

          tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power4.out'
          })

          tl.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          }, '-=0.7')

          tl.to(dividerRef.current, {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out'
          }, '-=0.5')

          if (cards.length > 0) {
            tl.to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.9,
                from: 'start',
                ease: 'power2.out'
              }
            }, '-=0.5')
          }
        },
      })

      cards.forEach((card) => {
        const icon = card.querySelector('.feature-icon') as HTMLElement
        if (icon) {
          card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.2,
              rotation: 8,
              duration: 0.4,
              ease: 'back.out(1.5)'
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 relative bg-[#0D1118]"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="text-white">Por Que </span>
            <span className="text-gradient">Nos Escolher?</span>
          </h2>
          <p 
            ref={subtitleRef}
            className="text-xl text-primary-lightest/70 max-w-2xl mx-auto"
          >
            Oferecemos a melhor experiência de compra com qualidade, segurança e confiança
          </p>
          <div ref={dividerRef} className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-[#0D1118]/60 backdrop-blur-sm rounded-2xl p-8 border border-primary-base/30 card-hover overflow-hidden"
            >
              <div className="feature-icon mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-base to-primary-light text-primary-lightest text-2xl transition-transform duration-300">
                <FontAwesomeIcon icon={feature.icon} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-lightest transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-primary-lightest/70 leading-relaxed group-hover:text-primary-lightest/90 transition-colors duration-300">
                {feature.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light/10 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}

