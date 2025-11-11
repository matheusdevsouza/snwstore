'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Cliente desde 2023',
      rating: 5,
      text: 'Produtos de excelente qualidade e entrega super rápida! A SNW Store sempre supera minhas expectativas. Recomendo muito!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'João Santos',
      role: 'Cliente desde 2022',
      rating: 5,
      text: 'Atendimento impecável e produtos originais. Sempre que preciso de algo, compro na SNW Store com total confiança.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Ana Costa',
      role: 'Cliente desde 2023',
      rating: 5,
      text: 'Melhor loja online que já comprei! Preços justos, produtos de qualidade e suporte que realmente funciona 24/7.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Carlos Oliveira',
      role: 'Cliente desde 2022',
      rating: 5,
      text: 'A SNW Store é sinônimo de confiança. Já fiz várias compras e nunca tive problemas. Entrega sempre no prazo!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Juliana Ferreira',
      role: 'Cliente desde 2024',
      rating: 5,
      text: 'Adorei a experiência de compra! Site fácil de usar, produtos incríveis e atendimento muito atencioso.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Roberto Lima',
      role: 'Cliente desde 2023',
      rating: 5,
      text: 'Produtos originais, preços competitivos e garantia real. A SNW Store é minha primeira opção para compras online.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !sectionRef.current) return

      const testimonialCards = Array.from(testimonialsRef.current?.querySelectorAll('.testimonial-card') || []) as HTMLElement[]

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center center'
      })
      gsap.set(testimonialCards, {
        opacity: 0,
        y: 60,
        scale: 0.9
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

          if (testimonialCards.length > 0) {
            tl.to(testimonialCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.6,
                from: 'start'
              }
            }, '-=0.4')
          }
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="pt-24 pb-24 px-4 relative bg-white overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-lightest/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-base/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-gray-900">O que nossos </span>
            <span className="text-gradient">clientes dizem</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            A satisfação dos nossos clientes é a nossa maior conquista. Veja o que eles têm a dizer sobre a experiência de compra na SNW Store.
          </p>
          <div ref={dividerRef} className="w-24 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mx-auto mt-8" />
        </div>

        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className="text-yellow-400 text-sm"
                      />
                    ))}
                  </div>
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-primary-light/30 text-3xl"
                  />
                </div>

                <p className="text-gray-700 leading-relaxed text-base mb-6 group-hover:text-gray-900 transition-colors duration-300">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-light/20 group-hover:ring-primary-light/40 transition-all duration-300">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary-light transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light/10 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-24" />
    </section>
  )
}

