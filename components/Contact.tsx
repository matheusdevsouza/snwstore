'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-card', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Form submitted:', formData)
  }

  const contactInfo = [
    {
      icon: faEnvelope,
      title: 'Email',
      content: 'contato@snow.com.br',
      link: 'mailto:contato@snow.com.br',
    },
    {
      icon: faPhone,
      title: 'Telefone',
      content: '(11) 99999-9999',
      link: 'tel:+5511999999999',
    },
    {
      icon: faWhatsapp,
      title: 'WhatsApp',
      content: '(11) 99999-9999',
      link: 'https://wa.me/5511999999999',
    },
  ]

  const socialLinks = [
    { icon: faInstagram, link: '#', label: 'Instagram' },
    { icon: faFacebook, link: '#', label: 'Facebook' },
    { icon: faWhatsapp, link: '#', label: 'WhatsApp' },
  ]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 px-4 relative bg-[#0D1118]"
    >
      <div className="container mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Entre em </span>
            <span className="text-gradient">Contato</span>
          </h2>
          <p className="text-xl text-primary-lightest/70 max-w-2xl mx-auto">
            Estamos sempre prontos para ajudar. Entre em contato conosco!
          </p>
          <div className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              Informações de Contato
            </h3>
            
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="contact-card block group bg-[#0D1118]/60 backdrop-blur-sm rounded-2xl p-6 border border-primary-base/30 card-hover"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-base to-primary-light flex items-center justify-center text-primary-lightest group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={info.icon} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-primary-lightest transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-primary-lightest/70">{info.content}</p>
                  </div>
                </div>
              </a>
            ))}

            <div className="pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Redes Sociais
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-base to-primary-light flex items-center justify-center text-primary-lightest hover:scale-110 transition-transform duration-300"
                    aria-label={social.label}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-card bg-[#0D1118]/60 backdrop-blur-sm rounded-2xl p-8 border border-primary-base/30">
            <h3 className="text-2xl font-bold text-white mb-6">
              Envie uma Mensagem
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary-lightest/90 mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#0D1118]/50 border border-primary-base/30 text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary-lightest/90 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#0D1118]/50 border border-primary-base/30 text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-primary-lightest/90 mb-2"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-primary-darkest/50 border border-primary-base/30 text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all resize-none"
                  placeholder="Sua mensagem..."
                  required
                />
              </div>
              <button
                type="submit"
                className="button-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Enviar Mensagem</span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}

