'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        x: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      })

      gsap.from(imageRef.current, {
        x: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const benefits = [
    'Produtos selecionados com rigoroso controle de qualidade',
    'Parcerias diretas com fornecedores confiáveis',
    'Preços competitivos no mercado',
    'Atendimento personalizado e humanizado',
    'Compromisso com a satisfação do cliente',
    'Transparência em todas as transações',
  ]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 px-4 relative bg-[#0D1118]"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          <div ref={contentRef} className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Sobre </span>
              <span className="text-gradient">a SNW STORE</span>
            </h2>
            <p className="text-xl text-primary-lightest/90 leading-relaxed">
              Somos uma revenda especializada em produtos de alta qualidade no Mercado Livre.
              Nossa missão é proporcionar a melhor experiência de compra, combinando produtos
              selecionados, preços justos e um atendimento excepcional.
            </p>
            <p className="text-lg text-primary-lightest/70 leading-relaxed">
              Com anos de experiência no mercado, construímos uma reputação sólida baseada
              na confiança e satisfação dos nossos clientes. Cada produto é cuidadosamente
              selecionado para garantir qualidade e originalidade.
            </p>

            <ul className="space-y-3 pt-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-primary-light mt-1 flex-shrink-0"
                  />
                  <span className="text-primary-lightest/80">{benefit}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="button-primary mt-6 inline-block">
              Entre em Contato
            </a>
          </div>

          <div
            ref={imageRef}
            className="flex-1 relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary-base/20 to-primary-light/10 border border-primary-base/30"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl text-primary-lightest/10">🏢</div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}

