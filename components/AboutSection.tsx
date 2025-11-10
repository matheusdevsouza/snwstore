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
  const valuesRef = useRef<HTMLDivElement>(null)

  const mainContent = [
    {
      icon: faHistory,
      title: 'Nossa História',
      description: 'A Snow nasceu com a missão de trazer os melhores produtos e experiências para nossos clientes. Desde o início, acreditamos que qualidade, transparência e compromisso são os pilares de um negócio de sucesso.',
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
            }, '-=0.3')
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
      className="pt-24 pb-24 px-4 relative bg-white overflow-hidden"
    >
      <div className="custom-shape-divider-top-1762751137">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className="shape-fill" />
        </svg>
      </div>

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
          {mainContent.map((content, index) => (
            <div
              key={index}
              className="main-card group relative bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-200 shadow-lg card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="text-3xl md:text-4xl mr-4 text-primary-light">
                    <FontAwesomeIcon icon={content.icon} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
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

              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light/10 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nossos <span className="text-gradient">Valores</span>
          </h3>
          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card group relative bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg card-hover overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="value-icon mb-4 text-4xl text-primary-light">
                  <FontAwesomeIcon icon={value.icon} />
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-light transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {value.description}
                </p>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light/10 via-transparent to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-24" />
    </section>
  )
}
