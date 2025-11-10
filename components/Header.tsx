'use client'

import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faShoppingCart, faHome, faBox, faInfoCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const logoAnimated = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      
      const sections = ['home', 'products', 'about', 'contact']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  useEffect(() => {
    const logoElement = logoRef.current
    if (!logoElement || logoAnimated.current) return
    
    const timer = setTimeout(() => {
      if (!logoRef.current) return
      
      const proxy = { scale: 0.8, x: -20 }
      
      gsap.to(proxy, {
        scale: 1,
        x: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.2,
        onUpdate: () => {
          if (logoRef.current) {
            logoRef.current.style.transform = `translateX(${proxy.x}px) scale(${proxy.scale})`
          }
        },
        onComplete: () => {
          if (logoRef.current) {
            logoRef.current.style.transform = ''
          }
        }
      })
      
      logoAnimated.current = true
    }, 100)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const logoElement = logoRef.current
    if (!logoElement) return

    const timer = setTimeout(() => {
      if (!logoRef.current) return

      let isHovering = false
      let hoverAnimation: gsap.core.Tween | null = null

      const handleMouseEnter = (e: Event) => {
        e.stopPropagation()
        if (!isHovering && logoRef.current) {
          isHovering = true
          if (hoverAnimation) hoverAnimation.kill()
          hoverAnimation = gsap.to(logoRef.current, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
          })
        }
      }

      const handleMouseLeave = (e: Event) => {
        e.stopPropagation()
        if (isHovering && logoRef.current) {
          isHovering = false
          // Voltar ao estado normal
          if (hoverAnimation) hoverAnimation.kill()
          hoverAnimation = gsap.to(logoRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
          })
        }
      }

      const linkElement = logoRef.current.closest('a')
      
      logoRef.current.addEventListener('mouseenter', handleMouseEnter)
      logoRef.current.addEventListener('mouseleave', handleMouseLeave)
      
      if (linkElement) {
        linkElement.addEventListener('mouseenter', handleMouseEnter)
        linkElement.addEventListener('mouseleave', handleMouseLeave)
      }
    }, 1200)

    return () => {
      clearTimeout(timer)
    }
  }, [])


  const navItems = [
    { name: 'Início', href: '#home', id: 'home', icon: faHome },
    { name: 'Produtos', href: '#products', id: 'products', icon: faBox },
    { name: 'Sobre', href: '#about', id: 'about', icon: faInfoCircle },
    { name: 'Contato', href: '#contact', id: 'contact', icon: faEnvelope },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-[#0D1118]/85 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-b border-primary-light/5'
          : 'bg-[#0D1118]/30 backdrop-blur-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] border-b border-primary-light/5'
      }`}
    >
      
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center space-x-3 relative cursor-pointer"
            >
              <div
                ref={logoRef}
                className="relative w-14 h-14 transition-transform duration-300 ease-out hover:scale-110 cursor-pointer opacity-100"
                style={{ 
                  transformOrigin: 'center',
                }}
              >
                <Image
                  src="/snow-logo.png"
                  alt="SNW STORE Logo"
                  fill
                  className="object-contain pointer-events-none select-none"
                  priority
                />
              </div>
            </a>
          </div>

          <ul
            ref={navRef}
            className="hidden lg:flex items-stretch rounded-full overflow-hidden border-2"
            style={{ borderColor: 'rgba(52, 171, 218, 0.15)' }}
          >
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id
              const isFirst = index === 0
              const isLast = index === navItems.length - 1
              
              let borderRadiusClass = ''
              if (isActive) {
                if (isFirst && isLast) {
                  borderRadiusClass = 'rounded-full'
                } else if (isFirst) {
                  borderRadiusClass = 'rounded-l-full'
                } else if (isLast) {
                  borderRadiusClass = 'rounded-r-full'
                } else {
                  borderRadiusClass = ''
                }
              } else {
                borderRadiusClass = ''
              }
              
              return (
                <li key={item.id} className={`group flex-1 ${!isActive ? 'bg-transparent' : ''}`}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 group flex items-center justify-center h-full
                      ${borderRadiusClass}
                      ${isActive
                        ? 'text-[#0D1118] bg-gradient-to-r from-primary-light/80 to-primary-lightest/80'
                        : 'text-primary-lightest/70 hover:text-white'
                      }`}
                    style={!isActive ? {
                      backgroundColor: 'transparent !important',
                      background: 'none',
                    } : {}}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                    )}
                    
                    <span className="relative z-10 flex items-center space-x-2">
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className={`text-xs transition-colors duration-300 ${
                          isActive ? 'text-[#0D1118]' : 'text-primary-lightest/70 group-hover:text-white'
                        }`}
                      />
                      <span>{item.name}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={(e) => handleNavClick(e, '#products')}
              className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-light to-primary-lightest 
                       text-[#0D1118] font-semibold text-sm shadow-lg shadow-primary-light/20
                       hover:shadow-xl hover:shadow-primary-light/30 transition-all duration-300
                       hover:scale-105 active:scale-95 overflow-hidden
                       cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                             -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center space-x-2">
                <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
                <span>Ver Produtos</span>
              </span>
              
              <span className="absolute inset-0 rounded-full border-2 border-primary-lightest/50 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          <button
            className="lg:hidden relative w-10 h-10 rounded-lg bg-primary-base/20 backdrop-blur-sm
                     border border-primary-light/20 flex items-center justify-center
                     text-primary-lightest hover:text-white hover:bg-primary-base/30
                     transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-lg transition-transform duration-300"
            />
            {!isMenuOpen && (
              <span className="absolute inset-0 rounded-lg bg-primary-light/20 animate-ping opacity-20" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(13, 13, 13, 0.95) 0%, rgba(13, 13, 13, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(48, 169, 217, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="container mx-auto px-6 py-6">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-primary-light/20 to-primary-lightest/10 border border-primary-light/30'
                        : 'text-primary-lightest/70 hover:text-white hover:bg-primary-base/10 border border-transparent'
                      }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={item.icon} className="text-sm" />
                        <span>{item.name}</span>
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
                      )}
                    </div>
                  </a>
                </li>
              )
            })}
            
            <li className="pt-2">
              <button
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-light to-primary-lightest 
                         text-[#0D1118] font-semibold text-base shadow-lg shadow-primary-light/20
                         hover:shadow-xl hover:shadow-primary-light/30 transition-all duration-300
                         active:scale-95 flex items-center justify-center space-x-2"
                onClick={(e) => {
                  handleNavClick(e, '#products')
                }}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Ver Produtos</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isScrolled && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-light/10 to-transparent" />
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(48, 169, 217, 0.08), rgba(153, 226, 242, 0.1), rgba(48, 169, 217, 0.08), transparent)',
              boxShadow: '0 0 20px rgba(48, 169, 217, 0.05), 0 0 40px rgba(153, 226, 242, 0.04)',
            }}
          />
        </>
      )}
    </header>
  )
}
