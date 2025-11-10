'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    produtos: [
      { name: 'Todos os Produtos', href: '#products' },
      { name: 'Mais Vendidos', href: '#' },
      { name: 'Promoções', href: '#' },
      { name: 'Novidades', href: '#' },
    ],
    empresa: [
      { name: 'Nossa História', href: '#' },
      { name: 'Política de Privacidade', href: '#' },
      { name: 'Termos de Uso', href: '#' },
    ],
    suporte: [
      { name: 'Central de Ajuda', href: '#' },
      { name: 'Contato', href: '#contact' },
      { name: 'FAQ', href: '#' },
      { name: 'Trocas e Devoluções', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: faInstagram, href: '#', label: 'Instagram' },
    { icon: faFacebook, href: '#', label: 'Facebook' },
    { icon: faWhatsapp, href: '#', label: 'WhatsApp' },
  ]

  return (
    <footer className="bg-[#0D1118] border-t border-primary-base/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14">
                <Image
                  src="/snow-logo.png"
                  alt="SNW Store Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-primary-lightest/70 mb-4 leading-relaxed">
              Sua revenda confiável no Mercado Livre. Produtos de qualidade
              com os melhores preços e entrega rápida.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-base/30 flex items-center justify-center text-primary-lightest hover:bg-primary-light hover:text-primary-darkest transition-all duration-300"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <ul className="space-y-2">
              {footerLinks.produtos.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-lightest/70 hover:text-primary-lightest transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-lightest/70 hover:text-primary-lightest transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-lightest/70 hover:text-primary-lightest transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-weak pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-lightest/50 text-sm">
              © {currentYear} SNW Store. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

