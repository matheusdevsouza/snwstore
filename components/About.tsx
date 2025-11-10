'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldAlt,
  faTruck,
  faHeadset,
  faLock,
  faCheckCircle,
  faAward,
} from '@fortawesome/free-solid-svg-icons'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const getGradientColors = (gradient: string) => {
    const gradients: Record<string, { from: string; to: string }> = {
      'from-blue-500 to-cyan-400': { from: '#3b82f6', to: '#22d3ee' },
      'from-cyan-400 to-blue-500': { from: '#22d3ee', to: '#3b82f6' },
      'from-blue-400 to-cyan-300': { from: '#60a5fa', to: '#67e8f9' },
      'from-cyan-500 to-blue-400': { from: '#06b6d4', to: '#60a5fa' },
    }
    return gradients[gradient] || { from: '#3b82f6', to: '#22d3ee' }
  }

  const features = [
    {
      icon: faShieldAlt,
      title: 'Compra 100% Segura',
      description: 'Todas as transações são protegidas com os mais altos padrões de segurança e criptografia. Seus dados estão sempre protegidos.',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: faTruck,
      title: 'Entrega Rápida',
      description: 'Enviamos seus produtos com agilidade e segurança. Frete rápido para todo o Brasil com rastreamento em tempo real.',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: faHeadset,
      title: 'Suporte Especializado',
      description: 'Nossa equipe está disponível 24/7 para tirar suas dúvidas e ajudar com qualquer questão relacionada aos seus pedidos.',
      color: 'from-blue-400 to-cyan-300',
    },
    {
      icon: faLock,
      title: 'Garantia Total',
      description: 'Oferecemos garantia completa em todos os produtos. Se não ficar satisfeito, devolvemos seu dinheiro sem complicações.',
      color: 'from-cyan-500 to-blue-400',
    },
    {
      icon: faCheckCircle,
      title: 'Produtos Verificados',
      description: 'Todos os produtos passam por rigoroso controle de qualidade. Garantimos originalidade e qualidade em cada item.',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      icon: faAward,
      title: 'Melhor Preço',
      description: 'Trabalhamos com os melhores preços do mercado. Sempre oferecendo condições especiais e promoções exclusivas.',
      color: 'from-cyan-400 to-blue-500',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !sectionRef.current) return

      const featureCards = Array.from(featuresRef.current?.querySelectorAll('.feature-card') || []) as HTMLElement[]

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center center'
      })
      gsap.set(featureCards, {
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

          if (featureCards.length > 0) {
            tl.to(featureCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.8,
                from: 'start'
              }
            }, '-=0.4')
          }
        },
      })

      featureCards.forEach((card) => {
        const icon = card.querySelector('.feature-icon') as HTMLElement
        if (icon) {
          let glowAnimation: gsap.core.Tween | null = null

          card.addEventListener('mouseenter', () => {
            gsap.killTweensOf(icon)

            glowAnimation = gsap.to(icon, {
              filter: 'brightness(1.5) drop-shadow(0 0 25px rgba(48, 169, 217, 0.9)) drop-shadow(0 0 40px rgba(153, 226, 242, 0.6))',
              duration: 1.8,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            })
          })

          card.addEventListener('mouseleave', () => {
            if (glowAnimation) {
              glowAnimation.kill()
              glowAnimation = null
            }

            gsap.killTweensOf(icon)

            gsap.to(icon, {
              filter: 'brightness(1) drop-shadow(0 0 0px rgba(0, 0, 0, 0))',
              duration: 0.5,
              ease: 'power3.out'
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
      id="about"
      className="py-24 px-4 relative bg-[#0D1118] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-lightest/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-base/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-white">Garantia e </span>
            <span className="text-gradient">Confiança</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-primary-lightest/80 max-w-3xl mx-auto leading-relaxed"
          >
            Sua satisfação e segurança são nossas prioridades. Trabalhamos com os mais altos
            padrões de qualidade e segurança para garantir a melhor experiência de compra.
          </p>
          <div ref={dividerRef} className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-gradient-to-br from-[#0D1118]/80 to-[#0D1118]/60 backdrop-blur-sm rounded-2xl p-8 border border-primary-base/30 card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className={`feature-icon mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-3xl shadow-lg transition-all duration-300 relative`} style={{ transform: 'translateZ(0)' }}>
                {(() => {
                  const colors = getGradientColors(feature.color)
                  return (
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      className="relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block',
                      }}
                    />
                  )
                })()}
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-lightest transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-primary-lightest/80 leading-relaxed group-hover:text-primary-lightest/90 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#products"
            className="button-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
          >
            <span>Ver Produtos</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}
