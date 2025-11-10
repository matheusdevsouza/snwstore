'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string
  rating: number
  image: string
  link: string
  discount?: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Produto Premium Exemplo 1',
    price: 'R$ 299,90',
    originalPrice: 'R$ 399,90',
    rating: 4.8,
    image: '/api/placeholder/400/400',
    link: '#',
    discount: 25,
  },
  {
    id: 2,
    name: 'Produto Premium Exemplo 2',
    price: 'R$ 499,90',
    originalPrice: 'R$ 599,90',
    rating: 4.9,
    image: '/api/placeholder/400/400',
    link: '#',
    discount: 17,
  },
  {
    id: 3,
    name: 'Produto Premium Exemplo 3',
    price: 'R$ 199,90',
    rating: 4.7,
    image: '/api/placeholder/400/400',
    link: '#',
  },
  {
    id: 4,
    name: 'Produto Premium Exemplo 4',
    price: 'R$ 399,90',
    originalPrice: 'R$ 499,90',
    rating: 5.0,
    image: '/api/placeholder/400/400',
    link: '#',
    discount: 20,
  },
  {
    id: 5,
    name: 'Produto Premium Exemplo 5',
    price: 'R$ 149,90',
    rating: 4.6,
    image: '/api/placeholder/400/400',
    link: '#',
  },
  {
    id: 6,
    name: 'Produto Premium Exemplo 6',
    price: 'R$ 599,90',
    originalPrice: 'R$ 799,90',
    rating: 4.9,
    image: '/api/placeholder/400/400',
    link: '#',
    discount: 25,
  },
]

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      })

      gsap.from('.product-card', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
          <p className="text-xl text-primary-lightest/70 max-w-2xl mx-auto">
            Explore nossa seleção cuidadosa de produtos de alta qualidade com os melhores preços do mercado
          </p>
          <div className="divider-weak w-24 mx-auto mt-8" />
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="button-secondary px-8 py-4 text-lg"
            onClick={() => {
              console.log('Carregar mais produtos')
            }}
          >
            Ver Mais Produtos
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-24" />
    </section>
  )
}

