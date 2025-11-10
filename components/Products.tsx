'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: string
  originalPrice: string
  rating: number
  image: string
  link: string
  description: string
  category: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Smartphone Premium 128GB',
    price: 'R$ 1.299,90',
    originalPrice: 'R$ 1.599,90',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    link: '#',
    description: 'Smartphone de última geração com tela AMOLED de 6.7 polegadas, processador octa-core de alta performance, câmera tripla de 64MP e bateria de longa duração. Perfeito para fotografia e multitarefas.',
    category: 'smartphones',
  },
  {
    id: 2,
    name: 'Fone de Ouvido Bluetooth',
    price: 'R$ 299,90',
    originalPrice: 'R$ 399,90',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    link: '#',
    description: 'Fones de ouvido sem fio com cancelamento de ruído ativo, som estéreo de alta qualidade e bateria que dura até 30 horas. Design ergonômico e confortável para uso prolongado.',
    category: 'acessorios',
  },
  {
    id: 3,
    name: 'Smartwatch Fitness',
    price: 'R$ 599,90',
    originalPrice: 'R$ 799,90',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    link: '#',
    description: 'Relógio inteligente com monitoramento de atividades físicas, frequência cardíaca, sono e muito mais. Resistente à água, tela colorida e conectividade Bluetooth para notificações.',
    category: 'acessorios',
  },
  {
    id: 4,
    name: 'Notebook Gamer 16GB',
    price: 'R$ 4.999,90',
    originalPrice: 'R$ 5.999,90',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    link: '#',
    description: 'Notebook gamer de alto desempenho com placa de vídeo dedicada, processador de última geração, 16GB de RAM e SSD rápido. Ideal para jogos e trabalhos que exigem performance.',
    category: 'gaming',
  },
  {
    id: 5,
    name: 'Tablet 10 polegadas',
    price: 'R$ 899,90',
    originalPrice: 'R$ 1.199,90',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    link: '#',
    description: 'Tablet com tela de 10 polegadas Full HD, processador quad-core, 64GB de armazenamento e suporte para caneta stylus. Perfeito para estudos, trabalho e entretenimento.',
    category: 'tablets',
  },
  {
    id: 6,
    name: 'Câmera Digital 4K',
    price: 'R$ 2.499,90',
    originalPrice: 'R$ 2.999,90',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    link: '#',
    description: 'Câmera digital profissional com gravação em 4K, lente intercambiável, estabilização de imagem e recursos avançados de fotografia. Ideal para fotógrafos amadores e profissionais.',
    category: 'cameras',
  },
  {
    id: 7,
    name: 'Mouse Gamer RGB',
    price: 'R$ 179,90',
    originalPrice: 'R$ 249,90',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    link: '#',
    description: 'Mouse gamer com iluminação RGB personalizável, sensor óptico de alta precisão, 8 botões programáveis e design ergonômico. Perfeito para jogos competitivos e trabalho.',
    category: 'gaming',
  },
  {
    id: 8,
    name: 'Teclado Mecânico',
    price: 'R$ 349,90',
    originalPrice: 'R$ 449,90',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    link: '#',
    description: 'Teclado mecânico com switches Cherry MX, retroiluminação RGB, construção em alumínio e design compacto. Resposta tátil excelente para gaming e digitação profissional.',
    category: 'gaming',
  },
]

const filters = [
  { id: 'all', name: 'Todos' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'acessorios', name: 'Acessórios' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'tablets', name: 'Tablets' },
  { id: 'cameras', name: 'Câmeras' },
]

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState(products)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === activeFilter))
    }
  }, [activeFilter])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !dividerRef.current || !sectionRef.current) return

      gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(dividerRef.current, { 
        opacity: 0, 
        scaleX: 0,
        transformOrigin: 'center center'
      })
      if (filtersRef.current) {
        gsap.set(filtersRef.current, { opacity: 0, y: 20 })
      }
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { opacity: 0, y: 20 })
      }

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

          if (filtersRef.current) {
            tl.to(filtersRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out'
            }, '-=0.4')
          }

          if (buttonRef.current) {
            tl.to(buttonRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out'
            }, '-=0.3')
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!cardsRef.current || !sectionRef.current) return

    let timeoutId: NodeJS.Timeout | null = null
    let scrollTriggerInstance: ScrollTrigger | null = null

    const ctx = gsap.context(() => {
      const cards = Array.from(cardsRef.current?.querySelectorAll('.product-card') || []) as HTMLElement[]
      
      if (cards.length === 0) return

      gsap.killTweensOf(cards)

      gsap.set(cards, {
        opacity: 0,
        y: 60,
        scale: 0.9
      })

      const animateCards = () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.2)',
          stagger: {
            amount: 0.8,
            from: 'start',
            ease: 'power2.out'
          }
        })
      }

      const checkIfVisible = () => {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (!rect) return false
        const windowHeight = window.innerHeight || document.documentElement.clientHeight
        const triggerPoint = windowHeight * 0.75
        return rect.top <= triggerPoint && rect.bottom >= 0
      }

      if (checkIfVisible()) {
        timeoutId = setTimeout(() => {
          animateCards()
        }, 150)
      } else {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            animateCards()
          }
        })
      }
    }, sectionRef)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill()
      }
      ctx.revert()
    }
  }, [filteredProducts])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!cardsRef.current) return

    const cards = Array.from(cardsRef.current.querySelectorAll('.product-card')) as HTMLElement[]
    
    const handlers: Array<{ card: HTMLElement; enter: () => void; leave: () => void }> = []

    cards.forEach((card) => {
      const image = card.querySelector('img') as HTMLElement
      
      const handleMouseEnter = () => {
        if (image) {
          gsap.to(image, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out'
          })
        }
      }

      const handleMouseLeave = () => {
        if (image) {
          gsap.to(image, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          })
        }
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      handlers.push({ card, enter: handleMouseEnter, leave: handleMouseLeave })
    })

    return () => {
      handlers.forEach(({ card, enter, leave }) => {
        card.removeEventListener('mouseenter', enter)
        card.removeEventListener('mouseleave', leave)
        const image = card.querySelector('img') as HTMLElement
        if (image) {
          gsap.killTweensOf(image)
        }
      })
    }
  }, [filteredProducts])

  return (
    <section
      ref={sectionRef}
      id="products"
      className="py-24 px-4 relative bg-[#0D1118]"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="text-white">Nossos </span>
            <span className="text-gradient">Produtos</span>
          </h2>
          <p 
            ref={subtitleRef}
            className="text-xl text-primary-lightest/70 max-w-2xl mx-auto"
          >
            Explore nossa seleção cuidadosa de produtos de alta qualidade com os melhores preços do mercado
          </p>
          <div ref={dividerRef} className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div 
          ref={filtersRef}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-primary-light to-primary-lightest text-[#0D1118] shadow-lg shadow-primary-light/20 scale-105'
                  : 'bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 text-primary-lightest/70 hover:text-white hover:border-primary-light/50 hover:bg-[#0D1118]/80'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          key={activeFilter}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-lightest/60 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            ref={buttonRef}
            className="button-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 mx-auto"
            onClick={() => {
              console.log('Carregar mais produtos')
            }}
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            <span>Ver Mais Produtos</span>
          </button>
        </div>
      </div>
    </section>
  )
}
