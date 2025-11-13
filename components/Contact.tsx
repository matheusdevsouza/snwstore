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
  faShoppingCart,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp as faWhatsappBrand } from '@fortawesome/free-brands-svg-icons'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const contactCardsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar mensagem. Por favor, tente novamente.')
      }

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)

    } catch (error: any) {
      console.error('Form submission error:', error)
      setSubmitError(error.message || 'Erro ao enviar mensagem. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      const formCard = formRef.current
      const infoCard = infoRef.current

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center center'
      })
      if (formCard) {
        gsap.set(formCard, { opacity: 0, y: 60, scale: 0.95 })
      }
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

          if (formCard) {
            tl.to(formCard, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)'
            }, '-=0.4')
          }

          if (infoCard) {
            tl.to(infoCard, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.2)'
            }, '-=0.6')
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
            Tem alguma dúvida ou sugestão? Entre em contato conosco através do formulário abaixo ou pelos nossos canais de atendimento.
          </p>
          <div ref={dividerRef} className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="flex">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative bg-gradient-to-br from-[#0D1118]/80 to-[#0D1118]/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-base/30 overflow-hidden w-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-8">
                  <div className="text-3xl md:text-4xl mr-4 text-primary-light">
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Envie sua Mensagem
                    </h3>
                    <p className="text-sm text-primary-lightest/60 mt-1">
                      Preencha o formulário abaixo
                    </p>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      placeholder="Assunto da mensagem"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300 resize-none"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary w-full py-4 px-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                  </button>
                </div>
              </div>
            </form>
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
