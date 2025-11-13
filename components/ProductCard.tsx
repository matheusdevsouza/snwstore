'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { trackProductClick } from '@/lib/analytics'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="product-card group relative bg-[#0D1118]/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary-base/30 card-hover">
      <button
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-[#0D1118]/90 backdrop-blur-md flex items-center justify-center text-primary-lightest hover:text-red-400 transition-all duration-300 hover:scale-110 hover:bg-[#0D1118] border border-primary-base/30"
        onClick={(e) => {
          e.stopPropagation()
          setIsFavorite(!isFavorite)
        }}
        aria-label="Adicionar aos favoritos"
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`transition-all duration-300 ${isFavorite ? 'text-red-400 scale-110' : ''}`}
        />
      </button>

      <div className="relative w-full h-64 mb-4 overflow-hidden bg-gradient-to-br from-primary-base/30 to-primary-light/10">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1118]/40 via-transparent to-transparent" />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={`text-xs ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-primary-base/30'
                }`}
              />
            ))}
            <span className="text-xs text-primary-lightest/60 ml-1.5">
              {product.rating}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-primary-lightest transition-colors duration-300 min-h-[3.5rem]">
          {product.name}
        </h3>

        <p className="text-sm text-primary-lightest/60 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <span className="text-2xl font-bold text-primary-light">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {product.original_price && (
            <span className="text-sm text-primary-lightest/50 line-through">
              R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        <div className="pt-2">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full button-primary flex items-center justify-center space-x-2 text-sm py-2.5"
            onClick={(e) => {
              e.stopPropagation()
              trackProductClick(
                product.id,
                product.name,
                product.category_slug,
                product.link
              )
            }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
            <span>Ver Anúncio</span>
          </a>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-light/5 to-primary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-light/10 via-transparent to-transparent" />
      </div>
    </div>
  )
}
