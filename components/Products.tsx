'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  price: number
  original_price: number | null
  rating: number
  image_url: string
  link: string
  description: string
  category_slug: string
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories?active=true')
        ])
        
        const productsResult = await productsRes.json()
        const categoriesResult = await categoriesRes.json()
        
        console.log('Products API response:', productsResult)
        console.log('Categories API response:', categoriesResult)
        
        if (productsResult.success && productsResult.data) {
          setProducts(productsResult.data)
          console.log('Products loaded:', productsResult.data.length)
        } else {
          console.error('Products API error:', productsResult.error, productsResult.details)
        }
        
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data)
          console.log('Categories loaded:', categoriesResult.data.length)
        } else {
          console.error('Categories API error:', categoriesResult.error, categoriesResult.details)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category_slug === activeFilter))
    }
  }, [activeFilter, products])

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
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-primary-light to-primary-lightest text-[#0D1118] shadow-lg shadow-primary-light/20 scale-105'
                : 'bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 text-primary-lightest/70 hover:text-white hover:border-primary-light/50 hover:bg-[#0D1118]/80'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveFilter(category.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category.slug
                  ? 'bg-gradient-to-r from-primary-light to-primary-lightest text-[#0D1118] shadow-lg shadow-primary-light/20 scale-105'
                  : 'bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 text-primary-lightest/70 hover:text-white hover:border-primary-light/50 hover:bg-[#0D1118]/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            <p className="text-primary-lightest/60 text-lg mt-4">Carregando produtos...</p>
          </div>
        ) : (
          <>
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
          </>
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
