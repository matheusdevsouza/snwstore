'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faPhone,
  faClock,
  faMapMarkerAlt,
  faHeadset,
  faChevronDown,
  faQuestionCircle,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp as faWhatsappBrand } from '@fortawesome/free-brands-svg-icons'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const contactCardsRef = useRef<HTMLDivElement>(null)

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const faqItems = [
    {
      question: 'Como faço para comprar um produto?',
      answer: 'Navegue pela seção de produtos, escolha o item desejado e clique em "Ver Anúncio". Você será redirecionado para o Mercado Livre, onde poderá finalizar sua compra de forma segura.',
    },
    {
      question: 'Os produtos são originais?',
      answer: 'Sim! Todos os produtos oferecidos pela SNW Store são 100% originais e acompanham nota fiscal. Trabalhamos apenas com revendedores autorizados e verificados.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo de entrega varia conforme o produto e a região. Geralmente, as entregas são realizadas em 5 a 15 dias úteis. O prazo exato será informado no momento da compra no Mercado Livre.',
    },
    {
      question: 'Como funciona a garantia?',
      answer: 'Todos os produtos possuem garantia do fabricante. Além disso, oferecemos suporte completo durante o período de garantia. Em caso de problemas, entre em contato conosco através dos canais disponíveis.',
    },
    {
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim! Oferecemos política de troca e devolução conforme a legislação vigente. Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução, desde que o produto esteja em perfeito estado.',
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'No Mercado Livre, você pode pagar com cartão de crédito, débito, boleto bancário, PIX e Mercado Pago. Todas as transações são 100% seguras e protegidas.',
    },
    {
      question: 'Como rastrear meu pedido?',
      answer: 'Após a confirmação da compra, você receberá um código de rastreamento por email. Use esse código no site dos Correios ou na plataforma do Mercado Livre para acompanhar sua entrega em tempo real.',
    },
    {
      question: 'Vocês oferecem suporte após a compra?',
      answer: 'Sim! Nossa equipe está disponível para ajudar com qualquer dúvida ou problema relacionado ao seu pedido. Entre em contato através do email ou telefone disponíveis na seção de informações de contato.',
    },
  ]

  const contactInfo = [
    {
      icon: faPhone,
      title: 'Telefone',
      content: '(11) 99999-9999',
      link: 'tel:+5511999999999',
    },
    {
      icon: faWhatsappBrand,
      title: 'WhatsApp',
      content: '(11) 99999-9999',
      link: 'https://wa.me/5511999999999',
    },
    {
      icon: faEnvelope,
      title: 'Email',
      content: 'contato@snow.com.br',
      link: 'mailto:contato@snow.com.br',
    },
    {
      icon: faShoppingCart,
      title: 'Mercado Livre',
      content: 'Visite nossa loja',
      link: 'https://www.mercadolivre.com.br',
    },
    {
      icon: faClock,
      title: 'Horário de Atendimento',
      content: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h',
      link: '#',
    },
    {
      icon: faMapMarkerAlt,
      title: 'Localização',
      content: 'São Paulo, SP - Brasil',
      link: '#',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !sectionRef.current) return

      const contactCards = Array.from(contactCardsRef.current?.querySelectorAll('.contact-info-card') || []) as HTMLElement[]
      const faqItems = Array.from(faqRef.current?.querySelectorAll('.faq-item') || []) as HTMLElement[]
      const infoCard = infoRef.current

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center center'
      })
      if (faqRef.current) {
        gsap.set(faqRef.current, { opacity: 0, y: 60, scale: 0.95 })
      }
      gsap.set(faqItems, {
        opacity: 0,
        y: 40,
        scale: 0.95
      })
      if (infoCard) {
        gsap.set(infoCard, { opacity: 0, y: 60, scale: 0.95 })
      }
      gsap.set(contactCards, {
        opacity: 0,
        y: 40,
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

          if (faqRef.current) {
            tl.to(faqRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)'
            }, '-=0.4')
          }

          if (faqItems.length > 0) {
            tl.to(faqItems, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.4,
                from: 'start'
              }
            }, '-=0.6')
          }

          if (infoCard) {
            tl.to(infoCard, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)'
            }, '-=0.8')
          }

          if (contactCards.length > 0) {
            tl.to(contactCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.2)',
              stagger: {
                amount: 0.5,
                from: 'start'
              }
            }, '-=0.7')
          }
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 px-4 relative bg-[#0D1118] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-lightest/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-base/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="text-white">Entre em </span>
            <span className="text-gradient">Contato</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-primary-lightest/70 max-w-3xl mx-auto leading-relaxed"
          >
            Encontre respostas para as perguntas mais frequentes ou entre em contato conosco!
          </p>
          <div ref={dividerRef} className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div ref={faqRef} className="flex">
            <div className="relative bg-gradient-to-br from-[#0D1118]/80 to-[#0D1118]/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-base/30 overflow-hidden w-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-8">
                  <div className="text-3xl md:text-4xl mr-4 text-primary-light">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Perguntas Frequentes
                    </h3>
                    <p className="text-sm text-primary-lightest/60 mt-1">
                      Tire suas dúvidas aqui
                    </p>
                  </div>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  {faqItems.map((faq, index) => (
                    <div
                      key={index}
                      className="faq-item group relative bg-gradient-to-br from-[#0D1118]/70 to-[#0D1118]/50 backdrop-blur-sm rounded-2xl border border-primary-base/30 overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full p-5 text-left flex items-center justify-between relative z-10 hover:text-primary-lightest transition-colors duration-300"
                      >
                        <h4 className="text-base md:text-lg font-bold text-white pr-4 group-hover:text-primary-lightest transition-colors duration-300">
                          {faq.question}
                        </h4>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-primary-light text-sm flex-shrink-0 transition-transform duration-500 ease-in-out ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                        style={{
                          transitionProperty: 'max-height, opacity',
                          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div className="px-5 pb-5 relative z-10">
                          <p className="text-sm md:text-base text-primary-lightest/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div ref={infoRef} className="flex">
            <div className="relative bg-gradient-to-br from-[#0D1118]/80 to-[#0D1118]/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-base/30 overflow-hidden w-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-8">
                  <div className="text-3xl md:text-4xl mr-4 text-primary-light">
                    <FontAwesomeIcon icon={faHeadset} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Informações de Contato
                    </h3>
                    <p className="text-sm text-primary-lightest/60 mt-1">
                      Entre em contato pelos canais abaixo
                    </p>
                  </div>
                </div>

                <div ref={contactCardsRef} className="space-y-4 flex-1">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.link}
                      target={info.link.startsWith('http') || info.link.startsWith('tel') || info.link.startsWith('mailto') ? '_blank' : '_self'}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="contact-info-card group relative bg-gradient-to-br from-[#0D1118]/70 to-[#0D1118]/50 backdrop-blur-sm rounded-2xl p-5 border border-primary-base/30 card-hover overflow-hidden flex items-center space-x-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="contact-icon relative z-10 text-2xl flex-shrink-0 text-primary-light">
                        <FontAwesomeIcon icon={info.icon} />
                      </div>

                      <div className="flex-1 relative z-10 min-w-0">
                        <h4 className="text-base font-bold text-white mb-1 group-hover:text-primary-lightest transition-colors duration-300">
                          {info.title}
                        </h4>
                        <p className="text-sm text-primary-lightest/70 group-hover:text-primary-lightest/90 transition-colors duration-300 truncate">
                          {info.content}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}
