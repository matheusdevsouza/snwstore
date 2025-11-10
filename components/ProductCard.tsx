'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="product-card group relative bg-gradient-card backdrop-blur-sm rounded-2xl p-6 border border-primary-base/30 card-hover cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.discount && (
        <div className="absolute top-4 right-4 z-10 bg-primary-light text-primary-darkest px-3 py-1 rounded-full text-sm font-bold">
          -{product.discount}%
        </div>
      )}

      <button
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-[#0D1118]/80 backdrop-blur-sm flex items-center justify-center text-primary-lightest hover:text-primary-light transition-all duration-300 hover:bg-[#0D1118]"
        onClick={(e) => {
          e.stopPropagation()
          setIsFavorite(!isFavorite)
        }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={isFavorite ? 'text-red-500' : ''}
        />
      </button>

      <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-primary-base/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-primary-lightest/20 text-6xl">📦</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-base/20 to-primary-light/10" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={`text-sm ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400'
                  : 'text-primary-base/30'
              }`}
            />
          ))}
          <span className="text-sm text-primary-lightest/70 ml-2">
            {product.rating}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-primary-lightest transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-light">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-primary-lightest/50 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 button-primary flex items-center justify-center space-x-2 text-sm py-2.5"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
            <span>Ver no ML</span>
          </a>
          <button className="px-4 py-2.5 rounded-lg border border-primary-light text-primary-light hover:bg-primary-light hover:text-primary-darkest transition-all duration-300">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        </div>
      </div>

      <div
        className={`absolute inset-0 rounded-2xl bg-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : ''
        }`}
      />
    </div>
  )
}

