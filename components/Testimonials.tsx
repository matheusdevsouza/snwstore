'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  role: string
  rating: number
  text: string
  avatar_url: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/testimonials')
        const result = await response.json()
        
        console.log('Testimonials API response:', result)
        
        if (result.success && result.data) {
          setTestimonials(result.data)
          console.log('Testimonials loaded:', result.data.length)
        } else {
          console.error('Testimonials API error:', result.error, result.details)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || isLoading || testimonials.length === 0) return

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
  }, [isLoading, testimonials])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="pt-24 pb-24 px-4 relative bg-transparent overflow-hidden"
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            <p className="mt-4 text-gray-600">Carregando depoimentos...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum depoimento disponível no momento.</p>
          </div>
        ) : (
          <div
            ref={testimonialsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => {
            const gradients = [
              'linear-gradient(135deg, rgba(153, 226, 242, 0.18) 0%, rgba(48, 169, 217, 0.12) 50%, rgba(153, 226, 242, 0.15) 100%)',
              'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
              'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(153, 226, 242, 0.18) 100%)',
              'linear-gradient(135deg, rgba(2, 56, 89, 0.12) 0%, rgba(48, 169, 217, 0.15) 50%, rgba(153, 226, 242, 0.12) 100%)',
              'linear-gradient(135deg, rgba(153, 226, 242, 0.18) 0%, rgba(48, 169, 217, 0.12) 50%, rgba(2, 56, 89, 0.08) 100%)',
              'linear-gradient(135deg, rgba(48, 169, 217, 0.12) 0%, rgba(153, 226, 242, 0.15) 50%, rgba(48, 169, 217, 0.1) 100%)',
            ]
            
            return (
              <div
                key={index}
                className="testimonial-card group relative rounded-3xl p-8 card-hover overflow-hidden"
                style={{
                  background: gradients[index % gradients.length],
                  border: '1px solid rgba(48, 169, 217, 0.2)',
                  boxShadow: '0 8px 32px rgba(48, 169, 217, 0.06), 0 0 15px rgba(48, 169, 217, 0.04)',
                }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
                  }}
                />

                <div 
                  className="absolute inset-0 rounded-3xl opacity-[0.02] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
                  }}
                />
              
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className="text-yellow-400 text-sm"
                          style={{
                            filter: 'drop-shadow(0 0 2px rgba(234, 179, 8, 0.3))',
                          }}
                        />
                      ))}
                    </div>
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="text-3xl transition-colors duration-300"
                      style={{
                        color: '#30A9D9',
                        opacity: 0.3,
                      }}
                    />
                  </div>

                  <p 
                    className="leading-relaxed text-base mb-6 transition-colors duration-300"
                    style={{
                      color: '#2a2a2a',
                    }}
                  >
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center space-x-4">
                    <div 
                      className="relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        boxShadow: '0 0 0 2px rgba(48, 169, 217, 0.2)',
                      }}
                    >
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 
                        className="text-lg font-bold transition-colors duration-300"
                        style={{
                          color: '#023859',
                        }}
                      >
                        {testimonial.name}
                      </h4>
                      <p 
                        className="text-sm transition-colors duration-300"
                        style={{
                          color: '#4a4a4a',
                        }}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-24" />
    </section>
  )
}

