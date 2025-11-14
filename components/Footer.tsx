'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faHeadset,
  faSnowflake,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  const footerLinks = {
    produtos: {
      title: 'Produtos',
      icon: faBox,
      links: [
        { name: 'Todos os Produtos', href: '#products' },
        { name: 'Mais Vendidos', href: '#products' },
        { name: 'Promoções', href: '#products' },
        { name: 'Novidades', href: '#products' },
      ],
    },
    informacoes: {
      title: 'Informações',
      icon: faInfoCircle,
      links: [
        { name: 'Sobre Nós', href: '#about' },
        { name: 'Depoimentos', href: '#testimonials' },
        { name: 'Como Funciona', href: '#contact' },
        { name: 'Garantias', href: '#contact' },
      ],
    },
    suporte: {
      title: 'Suporte',
      icon: faHeadset,
      links: [
        { name: 'Nossa História', href: '#about' },
        { name: 'Central de Ajuda', href: '#contact' },
        { name: 'Contato', href: '#contact' },
        { name: 'FAQ', href: '#contact' },
      ],
    },
  }

  const socialLinks = [
    { icon: faInstagram, href: '#', label: 'Instagram' },
    { icon: faFacebook, href: '#', label: 'Facebook' },
    { icon: faWhatsapp, href: '#', label: 'WhatsApp' },
  ]

  useEffect(() => {
    if (!footerRef.current) return

    const linkElements = footerRef.current.querySelectorAll('.footer-link-item')
    const cleanupFunctions: (() => void)[] = []
    
    linkElements.forEach((link) => {
        const snowflakeElement = link.querySelector('.link-snowflake') as HTMLElement

        if (!snowflakeElement) return

      const handleMouseEnter = () => {
        gsap.killTweensOf([snowflakeElement, link])
        
        const tl = gsap.timeline()
        
        tl.to(link, {
          paddingLeft: '2rem',
          duration: 0.4,
          ease: 'power2.out',
        })
        
        tl.fromTo(snowflakeElement, 
          {
            opacity: 0,
            scale: 0,
            x: '-1rem',
            rotation: -180,
          },
          {
            opacity: 1,
            scale: 1,
            x: '0',
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(2.5)',
          }, 
          '-=0.3'
        )

        gsap.to(snowflakeElement, {
          rotation: 360,
          duration: 3,
          ease: 'none',
          repeat: -1,
          delay: 0.6,
        })
      }

      const handleMouseLeave = () => {
        gsap.killTweensOf([snowflakeElement, link])
        
        const tl = gsap.timeline()
        
        tl.to(snowflakeElement, {
          opacity: 0,
          scale: 0,
          x: '-1rem',
          rotation: -90,
          duration: 0.3,
          ease: 'power2.in',
        }, 0)
        
        tl.to(link, {
          paddingLeft: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, '-=0.1')
      }

      link.addEventListener('mouseenter', handleMouseEnter)
      link.addEventListener('mouseleave', handleMouseLeave)

      cleanupFunctions.push(() => {
        link.removeEventListener('mouseenter', handleMouseEnter)
        link.removeEventListener('mouseleave', handleMouseLeave)
        gsap.killTweensOf([snowflakeElement, link])

        gsap.set(link, { paddingLeft: 0 })
      })
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  return (
    <footer ref={footerRef} className="bg-[#0D1118] border-t border-primary-base/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="relative w-14 h-14">
                <Image
                  src="/snow-logo.png"
                  alt="SNW Store Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-primary-lightest/50 mb-4 leading-relaxed">
              Sua revenda confiável no Mercado Livre. Produtos de qualidade
              com os melhores preços e entrega rápida.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-base/30 flex items-center justify-center text-primary-lightest/60 hover:bg-primary-light/50 hover:text-primary-lightest/80 transition-all duration-300"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white/5 md:bg-transparent rounded-lg p-4 md:p-0">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <FontAwesomeIcon 
                icon={footerLinks.produtos.icon} 
                className="text-primary-light/60 text-sm"
              />
              <span>{footerLinks.produtos.title}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.produtos.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="footer-link-item relative inline-block text-primary-lightest/50 hover:text-primary-lightest/70 transition-colors duration-300 group overflow-visible"
                  >
                    <span className="link-snowflake absolute left-0 top-1/2 -translate-y-1/2 opacity-0 origin-center">
                      <FontAwesomeIcon 
                        icon={faSnowflake} 
                        className="text-primary-light/60 text-sm"
                      />
                    </span>
                    <span className="relative z-10 block">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 md:bg-transparent rounded-lg p-4 md:p-0">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <FontAwesomeIcon 
                icon={footerLinks.informacoes.icon} 
                className="text-primary-light/60 text-sm"
              />
              <span>{footerLinks.informacoes.title}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.informacoes.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="footer-link-item relative inline-block text-primary-lightest/50 hover:text-primary-lightest/70 transition-colors duration-300 group overflow-visible"
                  >
                    <span className="link-snowflake absolute left-0 top-1/2 -translate-y-1/2 opacity-0 origin-center">
                      <FontAwesomeIcon 
                        icon={faSnowflake} 
                        className="text-primary-light/60 text-sm"
                      />
                    </span>
                    <span className="relative z-10 block">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 md:bg-transparent rounded-lg p-4 md:p-0">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <FontAwesomeIcon 
                icon={footerLinks.suporte.icon} 
                className="text-primary-light/60 text-sm"
              />
              <span>{footerLinks.suporte.title}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.suporte.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="footer-link-item relative inline-block text-primary-lightest/50 hover:text-primary-lightest/70 transition-colors duration-300 group overflow-visible"
                  >
                    <span className="link-snowflake absolute left-0 top-1/2 -translate-y-1/2 opacity-0 origin-center">
                      <FontAwesomeIcon 
                        icon={faSnowflake} 
                        className="text-primary-light/60 text-sm"
                      />
                    </span>
                    <span className="relative z-10 block">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-base/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-lightest/40 text-sm">
              © {new Date().getFullYear()} SNW Store. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a 
                href="#" 
                className="text-primary-lightest/40 hover:text-primary-lightest/60 transition-colors duration-300"
              >
                Termos de Uso
              </a>
              <span className="text-primary-lightest/30">•</span>
              <a 
                href="#" 
                className="text-primary-lightest/40 hover:text-primary-lightest/60 transition-colors duration-300"
              >
                Política de Privacidade
              </a>
              <span className="text-primary-lightest/30">•</span>
              <a 
                href="#" 
                className="text-primary-lightest/40 hover:text-primary-lightest/60 transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

