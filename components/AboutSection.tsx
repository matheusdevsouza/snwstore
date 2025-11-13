'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faRocket,
  faHeart,
  faBullseye,
  faHistory,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons'

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const mainCardsRef = useRef<HTMLDivElement>(null)
  const valuesTitleRef = useRef<HTMLHeadingElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  const mainContent = [
    {
      icon: faHistory,
      title: 'Nossa História',
      description: 'A SNW Store nasceu com a missão de trazer os melhores produtos e experiências para nossos clientes. Desde o início, acreditamos que qualidade, transparência e compromisso são os pilares de um negócio de sucesso.',
      additionalText: 'Ao longo dos anos, construímos uma comunidade de clientes satisfeitos que confiam em nós para suas necessidades. Cada produto que oferecemos passa por rigoroso controle de qualidade, garantindo originalidade e excelência.',
    },
    {
      icon: faFlagCheckered,
      title: 'Nossa Missão',
      description: 'Proporcionar aos nossos clientes acesso aos melhores produtos do mercado, com preços justos, entrega rápida e um atendimento excepcional que supera expectativas.',
      additionalText: 'Queremos ser mais que uma loja - queremos ser seu parceiro de confiança, oferecendo soluções que realmente fazem a diferença no seu dia a dia.',
    },
  ]

  const values = [
    {
      icon: faUsers,
      title: 'Compromisso com o Cliente',
      description: 'Colocamos nossos clientes em primeiro lugar, sempre buscando superar expectativas e oferecer a melhor experiência de compra.',
    },
    {
      icon: faRocket,
      title: 'Inovação Constante',
      description: 'Estamos sempre em busca das últimas tendências e tecnologias para oferecer produtos de ponta e soluções modernas.',
    },
    {
      icon: faHeart,
      title: 'Paixão pelo que Fazemos',
      description: 'Amamos o que fazemos e isso se reflete em cada produto, cada atendimento e cada detalhe do nosso trabalho.',
    },
    {
      icon: faBullseye,
      title: 'Excelência em Qualidade',
      description: 'Não medimos esforços para garantir que cada produto atenda aos mais altos padrões de qualidade e originalidade.',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !sectionRef.current) return

      const mainCards = Array.from(mainCardsRef.current?.querySelectorAll('.main-card') || []) as HTMLElement[]
      const valueCards = Array.from(valuesRef.current?.querySelectorAll('.value-card') || []) as HTMLElement[]

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center center'
      })
      gsap.set(mainCards, {
        opacity: 0,
        y: 60,
        scale: 0.9
      })
      gsap.set(valuesTitleRef.current, { opacity: 0, y: 40, scale: 0.95 })
      gsap.set(valueCards, {
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

          if (mainCards.length > 0) {
            tl.to(mainCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.4,
                from: 'start'
              }
            }, '-=0.4')
          }

          if (valuesTitleRef.current) {
            tl.to(valuesTitleRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out'
            }, '-=0.2')
          }

          if (valueCards.length > 0) {
            tl.to(valueCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.6,
                from: 'start'
              }
            }, '-=0.5')
          }
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="pt-24 pb-24 px-4 relative bg-transparent overflow-visible"
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
            <span className="text-gray-900">Sobre </span>
            <span className="text-gradient">Nós</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Conheça um pouco mais sobre nossa história, missão e os valores que nos guiam todos os dias
          </p>
          <div ref={dividerRef} className="w-24 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mx-auto mt-8" />
        </div>

        <div
          ref={mainCardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {mainContent.map((content, index) => {
            const gradients = [
              'linear-gradient(135deg, rgba(153, 226, 242, 0.18) 0%, rgba(48, 169, 217, 0.12) 50%, rgba(153, 226, 242, 0.15) 100%)',
              'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
            ]
            
            return (
              <div
                key={index}
                className="main-card group relative rounded-3xl p-8 md:p-10 card-hover overflow-hidden"
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
                  <div className="flex items-center mb-6">
                    <div className="text-3xl md:text-4xl mr-4 text-primary-light">
                      <FontAwesomeIcon icon={content.icon} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-primary-light transition-colors duration-300">
                      {content.title}
                    </h3>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-base mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {content.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                    {content.additionalText}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <h3 
            ref={valuesTitleRef}
            className="text-3xl font-bold text-gray-900 text-center mb-12"
          >
            Nossos <span className="text-gradient">Valores</span>
          </h3>
          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => {
              const gradients = [
                'linear-gradient(135deg, rgba(153, 226, 242, 0.18) 0%, rgba(48, 169, 217, 0.12) 50%, rgba(153, 226, 242, 0.15) 100%)',
                'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
                'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(153, 226, 242, 0.18) 100%)',
                'linear-gradient(135deg, rgba(2, 56, 89, 0.12) 0%, rgba(48, 169, 217, 0.15) 50%, rgba(153, 226, 242, 0.12) 100%)',
              ]
              
              return (
                <div
                  key={index}
                  className="value-card group relative rounded-2xl p-6 card-hover overflow-hidden"
                  style={{
                    background: gradients[index % gradients.length],
                    border: '1px solid rgba(48, 169, 217, 0.2)',
                    boxShadow: '0 8px 32px rgba(48, 169, 217, 0.06), 0 0 15px rgba(48, 169, 217, 0.04)',
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
                    }}
                  />

                  <div 
                    className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
                      backgroundSize: '40px 40px',
                    }}
                  />

                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
                    }}
                  />
                
                  <div className="relative z-10">
                    <div className="value-icon mb-4 text-4xl text-primary-light">
                      <FontAwesomeIcon icon={value.icon} />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-light transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
