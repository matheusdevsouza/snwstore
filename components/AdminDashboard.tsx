'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOutAlt,
  faBox,
  faComments,
  faEnvelope,
  faChartLine,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
  faSearch,
  faStar,
  faUser,
  faHome,
  faImage,
  faCircleNotch,
  faTags,
  faChevronDown,
  faFilter,
  faTimes,
  faListAlt,
  faClock,
  faMousePointer,
  faChartBar,
  faChevronLeft,
  faChevronRight,
  faThumbtack,
  faCheck,
  faCheckCircle,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import CategoryModal from './CategoryModal'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  price: number
  original_price: number | null
  rating: number
  image_url: string
  link: string
  category_slug: string
  stock_status?: string
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  rating: number
  text: string
  avatar_url: string
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  is_pinned?: boolean
  created_at: string
  read_at: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminDashboard({ user }: { user: User }) {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'testimonials' | 'messages' | 'stats' | 'categories' | 'logs'>('stats')

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`
    }
    return num.toString()
  }
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [analyticsLogs, setAnalyticsLogs] = useState<any[]>([])
  const [analyticsStats, setAnalyticsStats] = useState<any>(null)
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsDateFilter, setLogsDateFilter] = useState({ startDate: '', endDate: '' })
  const [logsEventTypeFilter, setLogsEventTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | Testimonial | Category | null>(null)
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null)
  
  const [productFilters, setProductFilters] = useState({
    category: 'all',
    status: 'all', 
    featured: 'all', 
    stockStatus: 'all' 
  })
  
  const [categoryFilters, setCategoryFilters] = useState({
    status: 'all' 
  })
  
  const [testimonialFilters, setTestimonialFilters] = useState({
    status: 'all', 
    featured: 'all', 
    rating: 'all' 
  })
  
  const [messageFilters, setMessageFilters] = useState({
    status: 'all', 
    date: 'all' 
  })

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'products') {
        const response = await fetch('/api/products?includeInactive=true', { credentials: 'include' })
        const data = await response.json()
        console.log('Admin Products API response:', data)
        if (data.success) {
          setProducts(data.data || [])
          console.log('Admin Products loaded:', data.data?.length || 0)
        } else {
          console.error('Admin Products API error:', data.error, data.details)
        }
      } else if (activeTab === 'testimonials') {
        const response = await fetch('/api/testimonials', { credentials: 'include' })
        const data = await response.json()
        if (data.success) {
          setTestimonials(data.data || [])
        }
      } else if (activeTab === 'messages') {
        const response = await fetch('/api/admin/messages', { credentials: 'include' })
        const data = await response.json()
        if (data.success) {
          setMessages(data.data || [])
          setUnreadMessages(data.unreadCount || 0)
        }
      } else if (activeTab === 'categories') {
        const response = await fetch('/api/categories', { credentials: 'include' })
        const data = await response.json()
        if (data.success) {
          setCategories(data.data || [])
        }
      } else if (activeTab === 'logs') {
        setLogsLoading(true)
        try {
          const params = new URLSearchParams()
          if (logsDateFilter.startDate) params.append('startDate', logsDateFilter.startDate)
          if (logsDateFilter.endDate) params.append('endDate', logsDateFilter.endDate)
          if (logsEventTypeFilter !== 'all') params.append('eventType', logsEventTypeFilter)
          
          const response = await fetch(`/api/analytics/stats?${params.toString()}`, { credentials: 'include' })
          const data = await response.json()
          if (data.success && data.data) {
            setAnalyticsLogs(data.data.logs || [])
            setAnalyticsStats(data.data.stats || null)
          }
        } catch (error) {
          console.error('Error loading analytics logs:', error)
        } finally {
          setLogsLoading(false)
        }
      } else if (activeTab === 'stats') {
        const productsRes = await fetch('/api/products?includeInactive=true', { credentials: 'include' })
        const productsData = await productsRes.json()
        console.log('Admin Stats Products API response:', productsData)
        if (productsData.success) {
          setProducts(productsData.data || [])
          console.log('Admin Stats Products loaded:', productsData.data?.length || 0)
        } else {
          console.error('Admin Stats Products API error:', productsData.error, productsData.details)
        }
        const testimonialsRes = await fetch('/api/testimonials', { credentials: 'include' })
        const testimonialsData = await testimonialsRes.json()
        if (testimonialsData.success) {
          setTestimonials(testimonialsData.data || [])
        }
        const messagesRes = await fetch('/api/admin/messages', { credentials: 'include' })
        const messagesData = await messagesRes.json()
        if (messagesData.success) {
          setMessages(messagesData.data || [])
          setUnreadMessages(messagesData.unreadCount || 0)
        }
        const categoriesRes = await fetch('/api/categories', { credentials: 'include' })
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.data || [])
        }
        setLogsLoading(true)
        try {
          const logsResponse = await fetch('/api/analytics/stats', { credentials: 'include' })
          const logsData = await logsResponse.json()
          if (logsData.success && logsData.data) {
            setAnalyticsLogs(logsData.data.logs || [])
            setAnalyticsStats(logsData.data.stats || null)
          }
        } catch (error) {
          console.error('Error loading analytics logs:', error)
        } finally {
          setLogsLoading(false)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, logsDateFilter, logsEventTypeFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDelete = async (type: 'product' | 'testimonial' | 'category' | 'message', id: string) => {
    const itemName = type === 'product' ? 'produto' : type === 'testimonial' ? 'depoimento' : type === 'category' ? 'categoria' : 'mensagem'
    const confirmMessage = `Tem certeza que deseja EXCLUIR PERMANENTEMENTE este ${itemName}? Esta ação não pode ser desfeita.`
    
    if (!confirm(confirmMessage)) return

    try {
      const endpoint = type === 'product' 
        ? `/api/products/${id}` 
        : type === 'testimonial'
        ? `/api/testimonials/${id}`
        : type === 'category'
        ? `/api/categories/${id}`
        : `/api/admin/messages/${id}`
      const response = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        loadData()
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erro ao excluir item. Por favor, tente novamente.')
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'read' })
      })

      if (response.ok) {
        loadData()
      } else {
        const errorData = await response.json()
        alert(`Erro ao marcar como lida: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Mark as read error:', error)
      alert('Erro ao marcar mensagem como lida. Por favor, tente novamente.')
    }
  }

  const handleTogglePin = async (messageId: string, currentPinStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_pinned: !currentPinStatus })
      })

      if (response.ok) {
        loadData()
      } else {
        const errorData = await response.json()
        alert(`Erro ao ${currentPinStatus ? 'desanexar' : 'anexar'} mensagem: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Toggle pin error:', error)
      alert('Erro ao alterar status da mensagem. Por favor, tente novamente.')
    }
  }

  const handleToggleStatus = async (type: 'product' | 'testimonial' | 'category', id: string, currentStatus: boolean) => {
    try {
      const endpoint = type === 'product' 
        ? `/api/products/${id}` 
        : type === 'testimonial'
        ? `/api/testimonials/${id}`
        : `/api/categories/${id}`
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !currentStatus })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = productFilters.category === 'all' || p.category_slug === productFilters.category
    const matchesStatus = productFilters.status === 'all' || 
      (productFilters.status === 'active' && p.is_active) ||
      (productFilters.status === 'inactive' && !p.is_active)
    const matchesFeatured = productFilters.featured === 'all' ||
      (productFilters.featured === 'featured' && p.is_featured) ||
      (productFilters.featured === 'not_featured' && !p.is_featured)
    const matchesStock = productFilters.stockStatus === 'all' ||
      (productFilters.stockStatus === 'in_stock' && p.stock_status === 'in_stock') ||
      (productFilters.stockStatus === 'out_of_stock' && p.stock_status === 'out_of_stock')
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesStock
  })

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = testimonialFilters.status === 'all' ||
      (testimonialFilters.status === 'active' && t.is_active) ||
      (testimonialFilters.status === 'inactive' && !t.is_active)
    const matchesFeatured = testimonialFilters.featured === 'all' ||
      (testimonialFilters.featured === 'featured' && t.is_featured) ||
      (testimonialFilters.featured === 'not_featured' && !t.is_featured)
    const matchesRating = testimonialFilters.rating === 'all' ||
      Math.floor(t.rating) === parseInt(testimonialFilters.rating)
    
    return matchesSearch && matchesStatus && matchesFeatured && matchesRating
  })

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = messageFilters.status === 'all' ||
      (messageFilters.status === 'new' && m.status === 'new') ||
      (messageFilters.status === 'read' && m.status === 'read')
    
    let matchesDate = true
    if (messageFilters.date !== 'all') {
      const messageDate = new Date(m.created_at)
      const now = new Date()
      const diffTime = now.getTime() - messageDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      if (messageFilters.date === 'today') {
        matchesDate = diffDays < 1
      } else if (messageFilters.date === 'week') {
        matchesDate = diffDays < 7
      } else if (messageFilters.date === 'month') {
        matchesDate = diffDays < 30
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = categoryFilters.status === 'all' ||
      (categoryFilters.status === 'active' && c.is_active) ||
      (categoryFilters.status === 'inactive' && !c.is_active)
    
    return matchesSearch && matchesStatus
  })

  const activeProducts = products.filter(p => p.is_active).length
  const activeTestimonials = testimonials.filter(t => t.is_active).length

  const navCategories = [
    {
      title: 'Visão Geral',
      items: [
        { id: 'stats', label: 'Estatísticas', icon: faChartLine, badge: null },
      ]
    },
    {
      title: 'Gerenciamento',
      items: [
        { id: 'products', label: 'Produtos', icon: faBox, badge: products.length },
        { id: 'categories', label: 'Categorias', icon: faTags, badge: categories.length },
        { id: 'testimonials', label: 'Depoimentos', icon: faComments, badge: testimonials.length },
        { id: 'logs', label: 'Logs', icon: faListAlt, badge: analyticsLogs.length },
      ]
    },
    {
      title: 'Comunicação',
      items: [
        { id: 'messages', label: 'Mensagens', icon: faEnvelope, badge: messages.length, unread: unreadMessages },
      ]
    },
  ]

  const ProductCardComponent = ({ product, isInactive, onToggleStatus, onEdit, onDelete }: { product: Product; isInactive: boolean; onToggleStatus: (type: 'product', id: string, currentStatus: boolean) => void; onEdit: () => void; onDelete: () => void }) => {
    return (
      <div
        className="group relative rounded-2xl overflow-hidden card-hover"
        style={{
          background: isInactive 
            ? 'linear-gradient(135deg, rgba(100, 100, 100, 0.12) 0%, rgba(60, 60, 60, 0.08) 50%, rgba(30, 30, 30, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
          border: isInactive 
            ? '1px solid rgba(100, 100, 100, 0.2)'
            : '1px solid rgba(48, 169, 217, 0.2)',
        }}
      >
        {!isInactive && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
            }}
          />
        )}

        <div 
          className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {!isInactive && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
            }}
          />
        )}

        <div className="relative z-10">
          <div className={`relative w-full h-48 overflow-hidden ${isInactive ? 'bg-gradient-to-br from-gray-700/30 to-gray-500/10' : 'bg-gradient-to-br from-primary-base/30 to-primary-light/10'}`}>
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${isInactive ? '' : 'group-hover:scale-110'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={isInactive ? { filter: 'grayscale(100%)' } : {}}
            />
            <div className={`absolute inset-0 ${isInactive ? 'bg-gradient-to-t from-[#0D1118]/80' : 'bg-gradient-to-t from-[#0D1118]/60'} via-transparent to-transparent`} />
            
            <div className={`absolute top-3 right-3 flex items-center justify-center gap-0.5 rounded-lg backdrop-blur-sm border p-0.5 ${
              isInactive
                ? 'bg-gray-800/80 border-gray-600/30'
                : 'bg-[#0D1118]/80 border-primary-base/30'
            }`}>
              <button
                onClick={() => onToggleStatus('product', product.id, product.is_active)}
                className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                title={product.is_active ? 'Desativar' : 'Ativar'}
              >
                <FontAwesomeIcon
                  icon={product.is_active ? faEye : faEyeSlash}
                  className={`${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300 text-xs`}
                />
              </button>
              <div className={`w-px h-4 ${isInactive ? 'bg-gray-600/30' : 'bg-primary-base/30'}`} />
              <button
                onClick={onEdit}
                className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                title="Editar"
              >
                <FontAwesomeIcon 
                  icon={faEdit} 
                  className={`text-xs ${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300`}
                />
              </button>
              <div className={`w-px h-4 ${isInactive ? 'bg-gray-600/30' : 'bg-primary-base/30'}`} />
              <button
                onClick={onDelete}
                className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                title="Excluir"
              >
                <FontAwesomeIcon 
                  icon={faTrash} 
                  className={`text-xs ${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300`}
                />
              </button>
            </div>
          </div>

          <div className="p-5">
            <h3 className={`text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem] transition-colors duration-300 ${isInactive ? 'text-gray-400' : 'text-white group-hover:text-primary-lightest'}`}>
              {product.name}
            </h3>
            
            {product.short_description && (
              <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-300 ${isInactive ? 'text-gray-500' : 'text-primary-lightest/70 group-hover:text-primary-lightest/90'}`}>
                {product.short_description}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`text-2xl font-bold transition-colors duration-300 ${isInactive ? 'text-gray-500' : 'text-primary-light group-hover:text-primary-lightest'}`}>
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {product.original_price && (
                  <p className={`text-sm line-through ${isInactive ? 'text-gray-600' : 'text-primary-lightest/50'}`}>
                    R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between text-xs pt-3 border-t transition-colors duration-300 ${isInactive ? 'text-gray-600 border-gray-700/20' : 'text-primary-lightest/60 group-hover:text-primary-lightest/80 border-primary-base/20'}`}>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faTags} className="text-xs" />
                {product.category_slug}
              </span>
              <span className="flex items-center gap-1">
                <span>#</span>
                {product.display_order}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1118] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 transition-all duration-300" style={{ left: 0, width: isSidebarCollapsed ? '5rem' : '18rem' }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-lightest/20 rounded-full blur-3xl" />
      </div>

      <div className="flex relative z-10">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`fixed top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-lg bg-[#0D1118]/80 border border-primary-base/30 text-primary-lightest/70 hover:text-primary-light hover:bg-[#0D1118] transition-all duration-300 hover:scale-110 shadow-lg`}
          style={{ left: isSidebarCollapsed ? 'calc(5rem + 0.75rem)' : 'calc(18rem + 0.75rem)' }}
          title={isSidebarCollapsed ? 'Expandir' : 'Retrair'}
        >
          <FontAwesomeIcon 
            icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} 
            className="text-sm"
          />
        </button>

        <aside className={`fixed top-0 left-0 h-screen bg-[#0D1118]/60 backdrop-blur-sm border-r border-primary-base/20 overflow-hidden flex flex-col z-20 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}>
          <div className={`relative z-10 ${isSidebarCollapsed ? 'p-4 mb-6' : 'p-6 mb-10'} flex ${isSidebarCollapsed ? 'justify-center' : 'justify-center'} items-center`}>
            {!isSidebarCollapsed && (
              <a
                href="/"
                target="_blank"
                className="relative w-16 h-16 transition-transform duration-300 hover:scale-110"
                title="Ver Site"
              >
                <Image
                  src="/snow-logo.png"
                  alt="SNW Store Logo"
                  fill
                  className="object-contain"
                />
              </a>
            )}
            {isSidebarCollapsed && (
              <a
                href="/"
                target="_blank"
                className="relative w-12 h-12 transition-transform duration-300 hover:scale-110"
                title="Ver Site"
              >
                <Image
                  src="/snow-logo.png"
                  alt="SNW Store Logo"
                  fill
                  className="object-contain"
                />
              </a>
            )}
          </div>

          <nav className={`relative z-10 flex-1 space-y-6 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            {navCategories.map((category, catIndex) => (
              <div key={catIndex}>
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-primary-lightest/40 uppercase tracking-wider mb-3 px-2">
                    {category.title}
                  </h3>
                )}
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`relative w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isSidebarCollapsed ? 'px-2' : 'px-4'} py-3 rounded-xl transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-[#0D1118]/80 border border-primary-base/40 shadow-lg'
                          : 'bg-[#0D1118]/60 border-transparent hover:bg-[#0D1118]/70'
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} ${isSidebarCollapsed ? '' : 'space-x-3'} flex-1 min-w-0`}>
                        <div className={`relative ${isSidebarCollapsed ? 'text-xl' : 'text-lg'} transition-colors duration-300 ${
                          activeTab === item.id ? 'text-primary-light' : 'text-primary-lightest/60'
                        }`}>
                          <FontAwesomeIcon icon={item.icon} />
                          {isSidebarCollapsed && item.badge !== null && (
                            <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                              (item as any).unread && (item as any).unread > 0
                                ? 'bg-red-500 text-white animate-pulse'
                                : activeTab === item.id
                                ? 'bg-primary-light/20 text-primary-lightest'
                                : 'bg-[#0D1118]/80 text-primary-lightest/60 border border-primary-base/30'
                            }`}>
                              {(item as any).unread && (item as any).unread > 0 
                                ? formatNumber((item as any).unread) 
                                : formatNumber(item.badge)}
                            </span>
                          )}
                        </div>
                        {!isSidebarCollapsed && (
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            activeTab === item.id ? 'text-white' : 'text-primary-lightest/70'
                          }`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isSidebarCollapsed && item.badge !== null && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center ${
                          (item as any).unread && (item as any).unread > 0
                            ? 'bg-red-500 text-white animate-pulse'
                            : activeTab === item.id
                            ? 'bg-primary-light/20 text-primary-lightest'
                            : 'bg-[#0D1118]/80 text-primary-lightest/60'
                        }`}>
                          {(item as any).unread && (item as any).unread > 0 
                            ? formatNumber((item as any).unread) 
                            : formatNumber(item.badge)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className={`relative z-10 mt-auto pt-6 border-t border-primary-base/20 space-y-3 ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light to-primary-base flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-primary-lightest/70 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-xs text-primary-lightest/60">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary-base flex items-center justify-center text-white font-bold text-base">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-2 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                  title="Sair"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                </button>
              </>
            )}
          </div>
        </aside>

        <main className={`flex-1 p-6 md:p-8 relative z-10 overflow-y-auto min-h-screen transition-all duration-300`} style={{ background: '#0a0d12', marginLeft: isSidebarCollapsed ? '5rem' : '18rem' }}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'stats' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-5xl text-primary-light">
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                      Estatísticas
                    </h1>
                  </div>
                  <p className="text-primary-lightest/70 text-lg">Visão geral do seu painel administrativo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="group relative rounded-2xl p-8 card-hover"
                    style={{
                      background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                      border: '1px solid rgba(48, 169, 217, 0.2)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-primary-lightest/80 font-semibold">Total de Produtos</h3>
                        <div className="text-3xl text-primary-light/70">
                          <FontAwesomeIcon icon={faBox} />
                        </div>
                      </div>
                      <p className="text-5xl font-bold text-white mb-2">{products.length}</p>
                      <p className="text-sm text-primary-lightest/60">
                        {products.filter(p => p.is_active).length} ativos
                      </p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl p-8 card-hover"
                    style={{
                      background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.12) 0%, rgba(2, 56, 89, 0.08) 50%, rgba(48, 169, 217, 0.1) 100%)',
                      border: '1px solid rgba(48, 169, 217, 0.2)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-primary-lightest/80 font-semibold">Total de Depoimentos</h3>
                        <div className="text-3xl text-primary-light/70">
                          <FontAwesomeIcon icon={faComments} />
                        </div>
                      </div>
                      <p className="text-5xl font-bold text-white mb-2">{testimonials.length}</p>
                      <p className="text-sm text-primary-lightest/60">
                        {testimonials.filter(t => t.is_active).length} ativos
                      </p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl p-8 card-hover"
                    style={{
                      background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                      border: '1px solid rgba(48, 169, 217, 0.2)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-primary-lightest/80 font-semibold">Mensagens</h3>
                        <div className="text-3xl text-primary-light/70">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                      </div>
                      <p className="text-5xl font-bold text-white mb-2">{messages.length}</p>
                      <p className="text-sm text-primary-lightest/60">
                        {unreadMessages} não lidas
                      </p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl p-8 card-hover"
                    style={{
                      background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                      border: '1px solid rgba(48, 169, 217, 0.2)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-primary-lightest/80 font-semibold">Categorias</h3>
                        <div className="text-3xl text-primary-light/70">
                          <FontAwesomeIcon icon={faTags} />
                        </div>
                      </div>
                      <p className="text-5xl font-bold text-white mb-2">{categories.length}</p>
                      <p className="text-sm text-primary-lightest/60">
                        {categories.filter(c => c.is_active).length} ativas
                      </p>
                    </div>
                  </div>
                </div>

                {analyticsStats && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Total de Eventos</h3>
                          <FontAwesomeIcon icon={faChartBar} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">{analyticsStats.totalEvents?.toLocaleString('pt-BR') || 0}</p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.12) 0%, rgba(2, 56, 89, 0.08) 50%, rgba(48, 169, 217, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Sessões Únicas</h3>
                          <FontAwesomeIcon icon={faUser} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">{analyticsStats.uniqueSessions?.toLocaleString('pt-BR') || 0}</p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Tempo Médio</h3>
                          <FontAwesomeIcon icon={faClock} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">
                          {analyticsStats.averageTimeSpent ? `${Math.floor(analyticsStats.averageTimeSpent / 60)}m ${analyticsStats.averageTimeSpent % 60}s` : '0m 0s'}
                        </p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Total Cliques</h3>
                          <FontAwesomeIcon icon={faMousePointer} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">
                          {(analyticsStats.eventTypes?.product_click || 0).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                    border: '1px solid rgba(48, 169, 217, 0.2)',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Logs de Conversão</h3>
                    <button
                      onClick={() => {
                        setActiveTab('logs')
                      }}
                      className="text-sm text-primary-light hover:text-primary-lightest transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>Ver todos</span>
                      <FontAwesomeIcon icon={faChevronDown} className="text-xs rotate-[-90deg]" />
                    </button>
                  </div>
                  
                  {logsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
                      <p className="mt-4 text-primary-lightest/60 text-sm">Carregando logs...</p>
                    </div>
                  ) : analyticsStats && analyticsStats.totalEvents > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-light">{analyticsStats.totalEvents.toLocaleString('pt-BR')}</p>
                          <p className="text-xs text-primary-lightest/60 mt-1">Total de Eventos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-light">{analyticsStats.uniqueSessions.toLocaleString('pt-BR')}</p>
                          <p className="text-xs text-primary-lightest/60 mt-1">Sessões Únicas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-light">
                            {Math.floor(analyticsStats.averageTimeSpent / 60)}m {analyticsStats.averageTimeSpent % 60}s
                          </p>
                          <p className="text-xs text-primary-lightest/60 mt-1">Tempo Médio</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-light">
                            {(analyticsStats.eventTypes?.product_click || 0).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-xs text-primary-lightest/60 mt-1">Cliques</p>
                        </div>
                      </div>

                      {analyticsStats.productClicks && analyticsStats.productClicks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary-lightest/80 mb-3">Produtos Mais Clicados</h4>
                          <div className="space-y-2">
                            {analyticsStats.productClicks.slice(0, 3).map((product: any, index: number) => (
                              <div
                                key={product.productId}
                                className="flex items-center justify-between p-3 rounded-xl"
                                style={{
                                  background: 'rgba(48, 169, 217, 0.08)',
                                  border: '1px solid rgba(48, 169, 217, 0.2)',
                                }}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-primary-lightest/50 font-bold">#{index + 1}</span>
                                  <span className="text-sm text-white truncate">{product.productName}</span>
                                </div>
                                <span className="text-sm font-bold text-primary-light ml-2">{product.clicks}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-primary-lightest/80 mb-3">Logs Recentes</h4>
                        <div className="rounded-xl overflow-hidden max-h-96 overflow-y-auto"
                          style={{
                            background: 'rgba(13, 17, 24, 0.4)',
                            border: '1px solid rgba(48, 169, 217, 0.2)',
                          }}
                        >
                          <table className="w-full text-sm">
                            <thead className="sticky top-0"
                              style={{
                                background: 'rgba(13, 17, 24, 0.95)',
                                borderBottom: '1px solid rgba(48, 169, 217, 0.2)',
                              }}
                            >
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Data/Hora</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Tipo</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Detalhes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsLogs.slice(0, 20).map((log: any) => (
                                <tr key={log.id} className="border-b border-primary-base/10 hover:bg-primary-base/5 transition-colors">
                                  <td className="px-3 py-2 text-xs text-primary-lightest/70">
                                    {new Date(log.created_at).toLocaleString('pt-BR', { 
                                      day: '2-digit', 
                                      month: '2-digit', 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-light/20 text-primary-light">
                                      {log.event_type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-xs text-primary-lightest/60">
                                    {log.product_name && <span>Produto: {log.product_name}</span>}
                                    {log.section_name && <span>Seção: {log.section_name}</span>}
                                    {log.time_spent && <span>Tempo: {log.time_spent}s</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-primary-lightest/60 text-sm">Nenhum log encontrado ainda</p>
                      <p className="text-primary-lightest/50 text-xs mt-2">Os logs aparecerão aqui quando houver atividade no site</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl text-primary-light">
                        <FontAwesomeIcon icon={faBox} />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                        Produtos
                      </h1>
                    </div>
                    <p className="text-primary-lightest/70 text-lg">Gerencie os produtos da loja</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setShowProductModal(true)
                    }}
                    className="button-primary flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Novo Produto</span>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative mb-6">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-lightest/40 z-10" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl text-white placeholder-primary-lightest/40 focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                        border: '1px solid rgba(48, 169, 217, 0.25)',
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-20">
                    <div className="flex items-center gap-2 text-primary-lightest/70 text-sm">
                      <FontAwesomeIcon icon={faFilter} className="text-primary-light" />
                      <span>Filtros:</span>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={productFilters.category}
                        onChange={(e) => setProductFilters({ ...productFilters, category: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todas as categorias</option>
                        {categories.filter(c => c.is_active).map((category) => (
                          <option key={category.id} value={category.slug} className="bg-[#0D1118] text-white">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={productFilters.status}
                        onChange={(e) => setProductFilters({ ...productFilters, status: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos os status</option>
                        <option value="active" className="bg-[#0D1118] text-white">Ativos</option>
                        <option value="inactive" className="bg-[#0D1118] text-white">Inativos</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={productFilters.featured}
                        onChange={(e) => setProductFilters({ ...productFilters, featured: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos</option>
                        <option value="featured" className="bg-[#0D1118] text-white">Em destaque</option>
                        <option value="not_featured" className="bg-[#0D1118] text-white">Não destacados</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={productFilters.stockStatus}
                        onChange={(e) => setProductFilters({ ...productFilters, stockStatus: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos os estoques</option>
                        <option value="in_stock" className="bg-[#0D1118] text-white">Em estoque</option>
                        <option value="out_of_stock" className="bg-[#0D1118] text-white">Sem estoque</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {(productFilters.category !== 'all' || productFilters.status !== 'all' || productFilters.featured !== 'all' || productFilters.stockStatus !== 'all') && (
                      <button
                        onClick={() => setProductFilters({ category: 'all', status: 'all', featured: 'all', stockStatus: 'all' })}
                        className="px-4 py-2 rounded-xl text-sm text-primary-lightest/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        <span>Limpar filtros</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-6"></div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
                  </div>
                ) : (
                  <>
                    {filteredProducts.filter(p => p.is_active).length > 0 && (
                      <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          Produtos Ativos ({filteredProducts.filter(p => p.is_active).length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredProducts.filter(p => p.is_active).map((product) => (
                            <ProductCardComponent key={product.id} product={product} isInactive={false} onToggleStatus={handleToggleStatus} onEdit={() => { setEditingItem(product); setShowProductModal(true); }} onDelete={() => handleDelete('product', product.id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredProducts.filter(p => !p.is_active).length > 0 && (
                      <div className="mt-12 pt-12 border-t border-primary-base/20">
                        <h2 className="text-2xl font-bold text-white/50 mb-6 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                          Produtos Inativos ({filteredProducts.filter(p => !p.is_active).length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredProducts.filter(p => !p.is_active).map((product) => (
                            <ProductCardComponent key={product.id} product={product} isInactive={true} onToggleStatus={handleToggleStatus} onEdit={() => { setEditingItem(product); setShowProductModal(true); }} onDelete={() => handleDelete('product', product.id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-12 text-primary-lightest/60">
                        Nenhum produto encontrado
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl text-primary-light">
                        <FontAwesomeIcon icon={faComments} />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                        Depoimentos
                      </h1>
                    </div>
                    <p className="text-primary-lightest/70 text-lg">Gerencie os depoimentos dos clientes</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setShowTestimonialModal(true)
                    }}
                    className="button-primary flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Novo Depoimento</span>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative mb-6">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-lightest/40 z-10" />
                    <input
                      type="text"
                      placeholder="Buscar depoimentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl text-white placeholder-primary-lightest/40 focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                        border: '1px solid rgba(48, 169, 217, 0.25)',
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-20">
                    <div className="flex items-center gap-2 text-primary-lightest/70 text-sm">
                      <FontAwesomeIcon icon={faFilter} className="text-primary-light" />
                      <span>Filtros:</span>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={testimonialFilters.status}
                        onChange={(e) => setTestimonialFilters({ ...testimonialFilters, status: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos os status</option>
                        <option value="active" className="bg-[#0D1118] text-white">Ativos</option>
                        <option value="inactive" className="bg-[#0D1118] text-white">Inativos</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={testimonialFilters.featured}
                        onChange={(e) => setTestimonialFilters({ ...testimonialFilters, featured: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos</option>
                        <option value="featured" className="bg-[#0D1118] text-white">Em destaque</option>
                        <option value="not_featured" className="bg-[#0D1118] text-white">Não destacados</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={testimonialFilters.rating}
                        onChange={(e) => setTestimonialFilters({ ...testimonialFilters, rating: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todas as avaliações</option>
                        <option value="5" className="bg-[#0D1118] text-white">⭐⭐⭐⭐⭐ 5 estrelas</option>
                        <option value="4" className="bg-[#0D1118] text-white">⭐⭐⭐⭐ 4 estrelas</option>
                        <option value="3" className="bg-[#0D1118] text-white">⭐⭐⭐ 3 estrelas</option>
                        <option value="2" className="bg-[#0D1118] text-white">⭐⭐ 2 estrelas</option>
                        <option value="1" className="bg-[#0D1118] text-white">⭐ 1 estrela</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {(testimonialFilters.status !== 'all' || testimonialFilters.featured !== 'all' || testimonialFilters.rating !== 'all') && (
                      <button
                        onClick={() => setTestimonialFilters({ status: 'all', featured: 'all', rating: 'all' })}
                        className="px-4 py-2 rounded-xl text-sm text-primary-lightest/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        <span>Limpar filtros</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-6"></div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="relative z-10 flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-primary-light/30 group-hover:ring-primary-light/50 transition-all duration-300">
                              <Image
                                src={testimonial.avatar_url}
                                alt={testimonial.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-white group-hover:text-primary-lightest transition-colors duration-300 text-lg">{testimonial.name}</h3>
                              <p className="text-sm text-primary-lightest/60 group-hover:text-primary-lightest/80 transition-colors duration-300">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-0.5 rounded-lg backdrop-blur-sm border p-0.5 bg-[#0D1118]/80 border-primary-base/30">
                            <button
                              onClick={() => handleToggleStatus('testimonial', testimonial.id, testimonial.is_active)}
                              className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                              title={testimonial.is_active ? 'Desativar' : 'Ativar'}
                            >
                              <FontAwesomeIcon
                                icon={testimonial.is_active ? faEye : faEyeSlash}
                                className="text-primary-light transition-colors duration-300 text-xs"
                              />
                            </button>
                            <div className="w-px h-4 bg-primary-base/30" />
                            <button
                              onClick={() => {
                                setEditingItem(testimonial)
                                setShowTestimonialModal(true)
                              }}
                              className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                              title="Editar"
                            >
                              <FontAwesomeIcon 
                                icon={faEdit} 
                                className="text-xs text-primary-light transition-colors duration-300"
                              />
                            </button>
                            <div className="w-px h-4 bg-primary-base/30" />
                            <button
                              onClick={() => handleDelete('testimonial', testimonial.id)}
                              className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                              title="Excluir"
                            >
                              <FontAwesomeIcon 
                                icon={faTrash} 
                                className="text-xs text-primary-light transition-colors duration-300"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="relative z-10 flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={`text-sm transition-all duration-300 ${i < testimonial.rating ? 'text-yellow-400 group-hover:scale-110' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <p className="relative z-10 text-primary-lightest/80 group-hover:text-primary-lightest text-sm line-clamp-3 transition-colors duration-300">{testimonial.text}</p>
                      </div>
                    ))}
                    {filteredTestimonials.length === 0 && (
                      <div className="text-center py-12 text-primary-lightest/60 col-span-2">
                        Nenhum depoimento encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-5xl text-primary-light">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                      Mensagens de Contato
                    </h1>
                  </div>
                  <p className="text-primary-lightest/70 text-lg">Visualize e gerencie as mensagens recebidas</p>
                </div>

                <div className="mb-6">
                  <div className="relative mb-6">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-lightest/40 z-10" />
                    <input
                      type="text"
                      placeholder="Buscar mensagens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl text-white placeholder-primary-lightest/40 focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                        border: '1px solid rgba(48, 169, 217, 0.25)',
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-20">
                    <div className="flex items-center gap-2 text-primary-lightest/70 text-sm">
                      <FontAwesomeIcon icon={faFilter} className="text-primary-light" />
                      <span>Filtros:</span>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={messageFilters.status}
                        onChange={(e) => setMessageFilters({ ...messageFilters, status: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todas as mensagens</option>
                        <option value="new" className="bg-[#0D1118] text-white">Não lidas</option>
                        <option value="read" className="bg-[#0D1118] text-white">Lidas</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={messageFilters.date}
                        onChange={(e) => setMessageFilters({ ...messageFilters, date: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todas as datas</option>
                        <option value="today" className="bg-[#0D1118] text-white">Hoje</option>
                        <option value="week" className="bg-[#0D1118] text-white">Última semana</option>
                        <option value="month" className="bg-[#0D1118] text-white">Último mês</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {(messageFilters.status !== 'all' || messageFilters.date !== 'all') && (
                      <button
                        onClick={() => setMessageFilters({ status: 'all', date: 'all' })}
                        className="px-4 py-2 rounded-xl text-sm text-primary-lightest/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        <span>Limpar filtros</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-6"></div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.filter(m => m.is_pinned).length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-primary-light mb-4 flex items-center gap-2">
                          <FontAwesomeIcon icon={faThumbtack} className="text-primary-light" />
                          Mensagens Anexadas
                        </h3>
                        <div className="space-y-4">
                          {filteredMessages.filter(m => m.is_pinned).map((message) => (
                            <div
                              key={message.id}
                              className="group relative rounded-2xl p-6 card-hover overflow-hidden"
                              style={{
                                background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                                border: '1px solid rgba(48, 169, 217, 0.2)',
                              }}
                            >
                              <div 
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
                                }}
                              />
                              <div 
                                className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                                style={{
                                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
                                  backgroundSize: '40px 40px',
                                }}
                              />
                              <div 
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                  boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
                                }}
                              />
                              <div className="relative z-10 flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary-lightest transition-colors duration-300">{message.name}</h3>
                                    <span className="text-sm text-primary-lightest/60 group-hover:text-primary-lightest/80 transition-colors duration-300">{message.email}</span>
                                    {message.status === 'new' && (
                                      <span className="px-3 py-1 bg-primary-light/20 text-primary-light text-xs rounded-full border border-primary-light/30">Nova</span>
                                    )}
                                    <span className="px-3 py-1 bg-primary-light/30 text-primary-lightest text-xs rounded-full border border-primary-light/40 flex items-center gap-1">
                                      <FontAwesomeIcon icon={faThumbtack} className="text-xs" />
                                      Anexada
                                    </span>
                                  </div>
                                  <p className="text-primary-light font-semibold mb-2 group-hover:text-primary-lightest transition-colors duration-300">{message.subject}</p>
                                  <p className="text-primary-lightest/80 group-hover:text-primary-lightest transition-colors duration-300 text-sm line-clamp-2 mb-3">{message.message.length > 150 ? message.message.substring(0, 150) + '...' : message.message}</p>
                                  <button
                                    onClick={() => {
                                      setViewingMessage(message)
                                      if (message.status === 'new') {
                                        handleMarkAsRead(message.id)
                                      }
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D1118]/60 border border-primary-base/30 text-primary-light hover:text-primary-lightest hover:bg-primary-light/10 hover:border-primary-light/50 transition-all duration-300 text-sm font-medium group/btn"
                                  >
                                    <FontAwesomeIcon icon={faEnvelopeOpen} className="text-xs group-hover/btn:scale-110 transition-transform duration-300" />
                                    Ler mensagem completa
                                  </button>
                                </div>
                                <div className="flex items-center justify-center gap-0.5 rounded-lg backdrop-blur-sm border p-0.5 bg-[#0D1118]/80 border-primary-base/30 ml-4">
                                  <button
                                    onClick={() => handleTogglePin(message.id, true)}
                                    className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                    title="Desanexar"
                                  >
                                    <FontAwesomeIcon
                                      icon={faThumbtack}
                                      className="text-primary-light transition-all duration-300 text-xs rotate-45"
                                    />
                                  </button>
                                  {message.status === 'new' && (
                                    <>
                                      <div className="w-px h-4 bg-primary-base/30" />
                                      <button
                                        onClick={() => handleMarkAsRead(message.id)}
                                        className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                        title="Marcar como lida"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCheckCircle}
                                          className="text-primary-light transition-colors duration-300 text-xs"
                                        />
                                      </button>
                                    </>
                                  )}
                                  <div className="w-px h-4 bg-primary-base/30" />
                                  <button
                                    onClick={() => handleDelete('message', message.id)}
                                    className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                    title="Excluir"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="text-primary-light transition-colors duration-300 text-xs"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="relative z-10 text-right text-sm text-primary-lightest/60 group-hover:text-primary-lightest/80 transition-colors duration-300">
                                <p>{new Date(message.created_at).toLocaleDateString('pt-BR')}</p>
                                <p>{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredMessages.filter(m => !m.is_pinned).map((message) => (
                      <div
                        key={message.id}
                        className="group relative rounded-2xl p-6 card-hover overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
                          }}
                        />
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                          style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                          }}
                        />
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
                          }}
                        />
                        <div className="relative z-10 flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-bold text-white group-hover:text-primary-lightest transition-colors duration-300">{message.name}</h3>
                              <span className="text-sm text-primary-lightest/60 group-hover:text-primary-lightest/80 transition-colors duration-300">{message.email}</span>
                              {message.status === 'new' && (
                                <span className="px-3 py-1 bg-primary-light/20 text-primary-light text-xs rounded-full border border-primary-light/30">Nova</span>
                              )}
                            </div>
                            <p className="text-primary-light font-semibold mb-2 group-hover:text-primary-lightest transition-colors duration-300">{message.subject}</p>
                            <p className="text-primary-lightest/80 group-hover:text-primary-lightest transition-colors duration-300 text-sm line-clamp-2 mb-3">{message.message.length > 150 ? message.message.substring(0, 150) + '...' : message.message}</p>
                            <button
                              onClick={() => {
                                setViewingMessage(message)
                                if (message.status === 'new') {
                                  handleMarkAsRead(message.id)
                                }
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D1118]/60 border border-primary-base/30 text-primary-light hover:text-primary-lightest hover:bg-primary-light/10 hover:border-primary-light/50 transition-all duration-300 text-sm font-medium group/btn"
                            >
                              <FontAwesomeIcon icon={faEnvelopeOpen} className="text-xs group-hover/btn:scale-110 transition-transform duration-300" />
                              Ler mensagem completa
                            </button>
                          </div>
                          <div className="flex items-center justify-center gap-0.5 rounded-lg backdrop-blur-sm border p-0.5 bg-[#0D1118]/80 border-primary-base/30 ml-4">
                            <button
                              onClick={() => handleTogglePin(message.id, message.is_pinned || false)}
                              className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                              title={message.is_pinned ? 'Desanexar' : 'Anexar no topo'}
                            >
                              <FontAwesomeIcon
                                icon={faThumbtack}
                                className={`text-primary-light transition-all duration-300 text-xs ${message.is_pinned ? 'rotate-45' : ''}`}
                              />
                            </button>
                            {message.status === 'new' && (
                              <>
                                <div className="w-px h-4 bg-primary-base/30" />
                                <button
                                  onClick={() => handleMarkAsRead(message.id)}
                                  className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                  title="Marcar como lida"
                                >
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-primary-light transition-colors duration-300 text-xs"
                                  />
                                </button>
                              </>
                            )}
                            <div className="w-px h-4 bg-primary-base/30" />
                            <button
                              onClick={() => handleDelete('message', message.id)}
                              className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                              title="Excluir"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-primary-light transition-colors duration-300 text-xs"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="relative z-10 text-right text-sm text-primary-lightest/60 group-hover:text-primary-lightest/80 transition-colors duration-300">
                          <p>{new Date(message.created_at).toLocaleDateString('pt-BR')}</p>
                          <p>{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                    {filteredMessages.length === 0 && (
                      <div className="text-center py-12 text-primary-lightest/60">
                        Nenhuma mensagem encontrada
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl text-primary-light">
                        <FontAwesomeIcon icon={faTags} />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                        Categorias
                      </h1>
                    </div>
                    <p className="text-primary-lightest/70 text-lg">Gerencie as categorias de produtos</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setShowCategoryModal(true)
                    }}
                    className="button-primary flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Nova Categoria</span>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative mb-6">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-lightest/40 z-10" />
                    <input
                      type="text"
                      placeholder="Buscar categorias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl text-white placeholder-primary-lightest/40 focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                        border: '1px solid rgba(48, 169, 217, 0.25)',
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-20">
                    <div className="flex items-center gap-2 text-primary-lightest/70 text-sm">
                      <FontAwesomeIcon icon={faFilter} className="text-primary-light" />
                      <span>Filtros:</span>
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={categoryFilters.status}
                        onChange={(e) => setCategoryFilters({ ...categoryFilters, status: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos os status</option>
                        <option value="active" className="bg-[#0D1118] text-white">Ativas</option>
                        <option value="inactive" className="bg-[#0D1118] text-white">Inativas</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {categoryFilters.status !== 'all' && (
                      <button
                        onClick={() => setCategoryFilters({ status: 'all' })}
                        className="px-4 py-2 rounded-xl text-sm text-primary-lightest/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        <span>Limpar filtros</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-6"></div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => {
                      const isInactive = !category.is_active
                      
                      return (
                        <div
                          key={category.id}
                          className="group relative rounded-2xl overflow-hidden card-hover"
                          style={{
                            background: isInactive 
                              ? 'linear-gradient(135deg, rgba(100, 100, 100, 0.12) 0%, rgba(60, 60, 60, 0.08) 50%, rgba(30, 30, 30, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                            border: isInactive 
                              ? '1px solid rgba(100, 100, 100, 0.2)'
                              : '1px solid rgba(48, 169, 217, 0.2)',
                          }}
                        >
                          {!isInactive && (
                            <div 
                              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: 'radial-gradient(circle at 50% 0%, rgba(48, 169, 217, 0.12) 0%, transparent 70%)',
                              }}
                            />
                          )}

                          <div 
                            className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                            style={{
                              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(48, 169, 217, 0.2) 1px, transparent 0)',
                              backgroundSize: '40px 40px',
                            }}
                          />

                          {!isInactive && (
                            <div 
                              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                boxShadow: 'inset 0 0 30px rgba(48, 169, 217, 0.15), 0 0 40px rgba(48, 169, 217, 0.1)',
                              }}
                            />
                          )}

                          <div className="relative z-10 p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                  isInactive 
                                    ? 'bg-gray-700/30 text-gray-400' 
                                    : 'bg-primary-light/20 text-primary-light group-hover:bg-primary-light/30 group-hover:scale-110'
                                }`}>
                                  <FontAwesomeIcon icon={faTags} className="text-xl" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className={`text-lg font-bold line-clamp-1 transition-colors duration-300 ${isInactive ? 'text-gray-400' : 'text-white group-hover:text-primary-lightest'}`}>
                                    {category.name}
                                  </h3>
                                </div>
                              </div>
                              
                              <div className={`flex items-center justify-center gap-0.5 rounded-lg backdrop-blur-sm border p-0.5 flex-shrink-0 ${
                                isInactive
                                  ? 'bg-gray-800/80 border-gray-600/30'
                                  : 'bg-[#0D1118]/80 border-primary-base/30'
                              }`}>
                                <button
                                  onClick={() => handleToggleStatus('category', category.id, category.is_active)}
                                  className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                  title={category.is_active ? 'Desativar' : 'Ativar'}
                                >
                                  <FontAwesomeIcon
                                    icon={category.is_active ? faEye : faEyeSlash}
                                    className={`${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300 text-xs`}
                                  />
                                </button>
                                <div className={`w-px h-4 ${isInactive ? 'bg-gray-600/30' : 'bg-primary-base/30'}`} />
                                <button
                                  onClick={() => {
                                    setEditingItem(category)
                                    setShowCategoryModal(true)
                                  }}
                                  className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                  title="Editar"
                                >
                                  <FontAwesomeIcon 
                                    icon={faEdit} 
                                    className={`text-xs ${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300`}
                                  />
                                </button>
                                <div className={`w-px h-4 ${isInactive ? 'bg-gray-600/30' : 'bg-primary-base/30'}`} />
                                <button
                                  onClick={() => handleDelete('category', category.id)}
                                  className="p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary-light/20 flex items-center justify-center"
                                  title="Excluir"
                                >
                                  <FontAwesomeIcon 
                                    icon={faTrash} 
                                    className={`text-xs ${isInactive ? 'text-gray-400' : 'text-primary-light'} transition-colors duration-300`}
                                  />
                                </button>
                              </div>
                            </div>

                            {category.description && (
                              <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${isInactive ? 'text-gray-500' : 'text-primary-lightest/70 group-hover:text-primary-lightest/90'}`}>
                                {category.description}
                              </p>
                            )}

                            <div className={`flex items-center justify-between text-xs pt-4 border-t transition-colors duration-300 ${isInactive ? 'text-gray-600 border-gray-700/20' : 'text-primary-lightest/60 group-hover:text-primary-lightest/80 border-primary-base/20'}`}>
                              <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTags} className="text-xs" />
                                <span className="font-medium">Slug:</span>
                                <span className="truncate max-w-[120px]">{category.slug}</span>
                              </span>
                              <span className="flex items-center gap-1 flex-shrink-0">
                                <span>Ordem:</span>
                                <span className="font-medium">#{category.display_order}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {filteredCategories.length === 0 && (
                      <div className="text-center py-12 text-primary-lightest/60 col-span-full">
                        Nenhuma categoria encontrada
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-5xl text-primary-light">
                      <FontAwesomeIcon icon={faListAlt} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-light">
                      Logs de Conversão
                    </h1>
                  </div>
                  <p className="text-primary-lightest/70 text-lg">
                    Análise detalhada do comportamento dos usuários e métricas de conversão
                  </p>
                </div>

                <div className="mb-6 mt-8">
                  <div className="flex flex-wrap items-center gap-3 mb-20">
                    <div className="flex items-center gap-2 text-primary-lightest/70 text-sm">
                      <FontAwesomeIcon icon={faFilter} className="text-primary-light" />
                      <span>Filtros:</span>
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="date"
                        value={logsDateFilter.startDate}
                        onChange={(e) => setLogsDateFilter({ ...logsDateFilter, startDate: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                        placeholder="Data inicial"
                      />
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="date"
                        value={logsDateFilter.endDate}
                        onChange={(e) => setLogsDateFilter({ ...logsDateFilter, endDate: e.target.value })}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                        placeholder="Data final"
                      />
                    </div>
                    
                    <div className="relative group">
                      <select
                        value={logsEventTypeFilter}
                        onChange={(e) => setLogsEventTypeFilter(e.target.value)}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer hover:border-primary-light/40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                          boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                        }}
                      >
                        <option value="all" className="bg-[#0D1118] text-white">Todos os eventos</option>
                        <option value="page_view" className="bg-[#0D1118] text-white">Visualizações de Página</option>
                        <option value="product_click" className="bg-[#0D1118] text-white">Cliques em Produtos</option>
                        <option value="product_view" className="bg-[#0D1118] text-white">Visualizações de Produtos</option>
                        <option value="time_on_page" className="bg-[#0D1118] text-white">Tempo na Página</option>
                        <option value="section_view" className="bg-[#0D1118] text-white">Visualizações de Seções</option>
                        <option value="button_click" className="bg-[#0D1118] text-white">Cliques em Botões</option>
                        <option value="form_submit" className="bg-[#0D1118] text-white">Submissões de Formulário</option>
                        <option value="scroll_depth" className="bg-[#0D1118] text-white">Profundidade de Scroll</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="text-primary-lightest/60 text-xs group-hover:text-primary-light transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setLogsDateFilter({ startDate: '', endDate: '' })
                        setLogsEventTypeFilter('all')
                        loadData()
                      }}
                      className="px-4 py-2 rounded-xl text-sm text-primary-lightest/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      <span>Limpar filtros</span>
                    </button>
                    
                    <button
                      onClick={loadData}
                      className="px-4 py-2 rounded-xl text-sm bg-primary-light/20 hover:bg-primary-light/30 text-primary-light border border-primary-light/30 transition-colors duration-300 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSearch} className="text-xs" />
                      <span>Atualizar</span>
                    </button>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mt-6"></div>
                </div>

                {logsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
                    <p className="mt-4 text-primary-lightest/60">Carregando logs...</p>
                  </div>
                ) : analyticsStats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Total de Eventos</h3>
                          <FontAwesomeIcon icon={faChartBar} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">{analyticsStats.totalEvents.toLocaleString('pt-BR')}</p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.12) 0%, rgba(2, 56, 89, 0.08) 50%, rgba(48, 169, 217, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Sessões Únicas</h3>
                          <FontAwesomeIcon icon={faUser} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">{analyticsStats.uniqueSessions.toLocaleString('pt-BR')}</p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Tempo Médio</h3>
                          <FontAwesomeIcon icon={faClock} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">
                          {Math.floor(analyticsStats.averageTimeSpent / 60)}m {analyticsStats.averageTimeSpent % 60}s
                        </p>
                      </div>

                      <div className="group relative rounded-2xl p-6 card-hover"
                        style={{
                          background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(153, 226, 242, 0.1) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-primary-lightest/80 font-semibold text-sm">Total Cliques</h3>
                          <FontAwesomeIcon icon={faMousePointer} className="text-2xl text-primary-light/70" />
                        </div>
                        <p className="text-4xl font-bold text-white">
                          {(analyticsStats.eventTypes?.product_click || 0).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {analyticsStats.productClicks && analyticsStats.productClicks.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Produtos Mais Clicados</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {analyticsStats.productClicks.slice(0, 9).map((product: any, index: number) => (
                            <div
                              key={product.productId}
                              className="group relative rounded-xl p-4 card-hover"
                              style={{
                                background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.12) 0%, rgba(48, 169, 217, 0.08) 50%, rgba(2, 56, 89, 0.05) 100%)',
                                border: '1px solid rgba(48, 169, 217, 0.2)',
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-primary-lightest/50">#{index + 1}</span>
                                <span className="text-lg font-bold text-primary-light">{product.clicks}</span>
                              </div>
                              <h3 className="text-sm font-semibold text-white line-clamp-2">{product.productName}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analyticsStats.sectionViews && analyticsStats.sectionViews.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Seções Mais Visualizadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analyticsStats.sectionViews.map((section: any) => (
                            <div
                              key={section.sectionName}
                              className="group relative rounded-xl p-4 card-hover"
                              style={{
                                background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.12) 0%, rgba(2, 56, 89, 0.08) 50%, rgba(48, 169, 217, 0.1) 100%)',
                                border: '1px solid rgba(48, 169, 217, 0.2)',
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white capitalize">{section.sectionName}</h3>
                                <span className="text-lg font-bold text-primary-light">{section.views}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">Logs Recentes</h2>
                      <div className="rounded-2xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.2)',
                        }}
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-primary-base/20">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Data/Hora</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Detalhes</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-lightest/70 uppercase">Sessão</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsLogs.slice(0, 50).map((log: any) => (
                                <tr key={log.id} className="border-b border-primary-base/10 hover:bg-primary-base/5 transition-colors">
                                  <td className="px-4 py-3 text-sm text-primary-lightest/80">
                                    {new Date(log.created_at).toLocaleString('pt-BR')}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-light/20 text-primary-light">
                                      {log.event_type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-primary-lightest/70">
                                    {log.product_name && (
                                      <div>Produto: {log.product_name}</div>
                                    )}
                                    {log.section_name && (
                                      <div>Seção: {log.section_name}</div>
                                    )}
                                    {log.button_name && (
                                      <div>Botão: {log.button_name}</div>
                                    )}
                                    {log.time_spent && (
                                      <div>Tempo: {log.time_spent}s</div>
                                    )}
                                    {log.scroll_depth && (
                                      <div>Scroll: {log.scroll_depth}%</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-primary-lightest/50 font-mono">
                                    {log.session_id?.substring(0, 16)}...
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-primary-lightest/60">Nenhum log encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showProductModal && (
        <ProductModal
          product={editingItem as Product | null}
          onClose={() => {
            setShowProductModal(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowProductModal(false)
            setEditingItem(null)
            loadData()
          }}
        />
      )}

      {showTestimonialModal && (
        <TestimonialModal
          testimonial={editingItem as Testimonial | null}
          onClose={() => {
            setShowTestimonialModal(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowTestimonialModal(false)
            setEditingItem(null)
            loadData()
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          category={editingItem as Category | null}
          onClose={() => {
            setShowCategoryModal(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowCategoryModal(false)
            setEditingItem(null)
            loadData()
          }}
        />
      )}

      {viewingMessage && (
        <MessageViewModal
          message={viewingMessage}
          onClose={() => {
            setViewingMessage(null)
            loadData()
          }}
          onTogglePin={(isPinned) => handleTogglePin(viewingMessage.id, isPinned)}
          onMarkAsRead={() => {
            if (viewingMessage.status === 'new') {
              handleMarkAsRead(viewingMessage.id)
            }
          }}
          onDelete={() => {
            handleDelete('message', viewingMessage.id)
            setViewingMessage(null)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    rating: product?.rating?.toString() || '0',
    image_url: product?.image_url || '',
    link: product?.link || '',
    category_slug: product?.category_slug || '',
    stock_status: product?.stock_status || 'in_stock',
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== undefined ? product.is_active : true,
    display_order: product?.display_order?.toString() || '0'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url || null)
  const [showPreview, setShowPreview] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product?.image_url) {
      setPreviewUrl(product.image_url)
    } else {
      setPreviewUrl(null)
    }
  }, [product])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const response = await fetch('/api/categories?active=true', { credentials: 'include' })
        const data = await response.json()
        if (data.success && data.data) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use: JPEG, PNG, WEBP ou GIF')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    setError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao fazer upload da imagem')
        setIsUploading(false)
        return
      }

      setFormData({ ...formData, image_url: data.url })
      setIsUploading(false)
    } catch (error: any) {
      setError('Erro ao fazer upload da imagem')
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image_url) {
      setError('Por favor, faça upload de uma imagem')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          rating: parseFloat(formData.rating),
          display_order: parseInt(formData.display_order)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao salvar produto')
        setIsSubmitting(false)
        return
      }

      onSave()
    } catch (error: any) {
      setError('Erro ao salvar produto')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1118]/95 backdrop-blur-md border border-primary-base/30 rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl" />
        </div>
        
        <div 
          className="relative z-10 flex-shrink-0 p-8 pb-4 backdrop-blur-md border-b border-primary-base/20"
          style={{
            background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {product ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <p className="text-sm text-primary-lightest/60 mt-1">
                {product ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-lightest/60 hover:text-white transition-colors hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 p-8 pt-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Nome *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Descrição *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 resize-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Descrição Curta</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Categoria *</label>
            <div className="relative group">
              <select
                required
                value={formData.category_slug}
                onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                className="w-full px-4 py-3 pr-12 appearance-none rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-light/40 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(153, 226, 242, 0.15) 0%, rgba(48, 169, 217, 0.1) 50%, rgba(2, 56, 89, 0.08) 100%)',
                  border: '1px solid rgba(48, 169, 217, 0.3)',
                  boxShadow: '0 2px 8px rgba(48, 169, 217, 0.1)',
                }}
                disabled={isLoadingCategories}
              >
                <option value="" className="bg-[#0D1118] text-primary-lightest/60">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug} className="bg-[#0D1118] text-white">
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-primary-lightest/60 text-sm transition-all duration-300 group-hover:text-primary-light ${isLoadingCategories ? 'opacity-50' : ''}`}
                />
              </div>
              {isLoadingCategories && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faCircleNotch} 
                    className="text-primary-lightest/60 text-sm animate-spin"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Preço *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Preço Original</label>
              <input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Link do Anúncio *</label>
            <input
              type="url"
              required
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Ordem de Exibição</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="custom-checkbox"
              />
              <span className="text-primary-lightest/80 group-hover:text-white transition-colors duration-300 font-medium">Em Destaque</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="custom-checkbox"
              />
              <span className="text-primary-lightest/80 group-hover:text-white transition-colors duration-300 font-medium">Ativo</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-primary-lightest/80">Imagem do Produto *</label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 hover:border-primary-light/50 transition-all duration-300 text-primary-lightest/80 hover:text-white group"
                >
                  <FontAwesomeIcon 
                    icon={showPreview ? faEyeSlash : faEye} 
                    className="text-sm transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-sm font-medium">
                    {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                  </span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              {previewUrl && showPreview && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary-light/30 shadow-lg group">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1118]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full relative group"
                >
                  <div 
                    className="relative px-6 py-8 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden"
                    style={{
                      borderColor: isUploading ? 'rgba(48, 169, 217, 0.3)' : 'rgba(48, 169, 217, 0.4)',
                      background: isUploading 
                        ? 'linear-gradient(135deg, rgba(48, 169, 217, 0.08) 0%, rgba(2, 56, 89, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(48, 169, 217, 0.1) 0%, transparent 70%)',
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.2) 0%, rgba(153, 226, 242, 0.15) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                        }}
                      >
                        <FontAwesomeIcon 
                          icon={isUploading ? faCircleNotch : faImage} 
                          className={`text-2xl transition-all duration-300 ${isUploading ? 'animate-spin text-primary-light' : 'text-primary-lightest/80 group-hover:text-primary-light'}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-primary-lightest/90 font-medium text-base group-hover:text-white transition-colors duration-300">
                          {isUploading ? 'Enviando imagem...' : 'Clique para escolher uma imagem'}
                        </p>
                        <p className="text-primary-lightest/50 text-xs mt-1">
                          {formData.image_url ? '✓ Imagem carregada' : 'Formatos: JPEG, PNG, WEBP, GIF • Máx: 5MB'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-primary-lightest/60 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function TestimonialModal({ testimonial, onClose, onSave }: { testimonial: Testimonial | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    rating: testimonial?.rating?.toString() || '5',
    text: testimonial?.text || '',
    avatar_url: testimonial?.avatar_url || '',
    is_featured: testimonial?.is_featured || false,
    is_active: testimonial?.is_active !== undefined ? testimonial.is_active : true,
    display_order: testimonial?.display_order?.toString() || '0'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(testimonial?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use: JPEG, PNG, WEBP ou GIF')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    setError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao fazer upload da imagem')
        setIsUploading(false)
        return
      }

      setFormData({ ...formData, avatar_url: data.url })
      setIsUploading(false)
    } catch (error: any) {
      setError('Erro ao fazer upload da imagem')
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.avatar_url) {
      setError('Por favor, faça upload de uma foto ou forneça uma URL')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const url = testimonial ? `/api/testimonials/${testimonial.id}` : '/api/testimonials'
      const method = testimonial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating),
          display_order: parseInt(formData.display_order)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao salvar depoimento')
        setIsSubmitting(false)
        return
      }

      onSave()
    } catch (error: any) {
      setError('Erro ao salvar depoimento')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1118]/95 backdrop-blur-md border border-primary-base/30 rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl" />
        </div>
        
        <div 
          className="relative z-10 flex-shrink-0 p-8 pb-4 backdrop-blur-md border-b border-primary-base/20"
          style={{
            background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {testimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h2>
              <p className="text-sm text-primary-lightest/60 mt-1">
                {testimonial ? 'Atualize as informações do depoimento' : 'Adicione um novo depoimento de cliente'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-lightest/60 hover:text-white transition-colors hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 p-8 pt-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Nome *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                placeholder="Cliente desde 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Texto do Depoimento *</label>
            <textarea
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 resize-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-3">Foto do Avatar *</label>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary-light/30 shadow-lg">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full relative group"
                >
                  <div 
                    className="relative px-6 py-8 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden"
                    style={{
                      borderColor: isUploading ? 'rgba(48, 169, 217, 0.3)' : 'rgba(48, 169, 217, 0.4)',
                      background: isUploading 
                        ? 'linear-gradient(135deg, rgba(48, 169, 217, 0.08) 0%, rgba(2, 56, 89, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(153, 226, 242, 0.08) 0%, rgba(48, 169, 217, 0.05) 50%, rgba(2, 56, 89, 0.03) 100%)',
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(48, 169, 217, 0.1) 0%, transparent 70%)',
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.2) 0%, rgba(153, 226, 242, 0.15) 100%)',
                          border: '1px solid rgba(48, 169, 217, 0.3)',
                        }}
                      >
                        <FontAwesomeIcon 
                          icon={isUploading ? faCircleNotch : faImage} 
                          className={`text-2xl transition-all duration-300 ${isUploading ? 'animate-spin text-primary-light' : 'text-primary-lightest/80 group-hover:text-primary-light'}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-primary-lightest/90 font-medium text-base group-hover:text-white transition-colors duration-300">
                          {isUploading ? 'Enviando foto...' : 'Clique para escolher uma foto'}
                        </p>
                        <p className="text-primary-lightest/50 text-xs mt-1">
                          {formData.avatar_url ? '✓ Foto carregada' : 'Formatos: JPEG, PNG, WEBP, GIF • Máx: 5MB'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Avaliação (1-5) *</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Ordem de Exibição</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="custom-checkbox"
              />
              <span className="text-primary-lightest/80 group-hover:text-white transition-colors duration-300 font-medium">Em Destaque</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="custom-checkbox"
              />
              <span className="text-primary-lightest/80 group-hover:text-white transition-colors duration-300 font-medium">Ativo</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-primary-lightest/60 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function MessageViewModal({ 
  message, 
  onClose, 
  onTogglePin, 
  onMarkAsRead, 
  onDelete 
}: { 
  message: ContactMessage
  onClose: () => void
  onTogglePin: (isPinned: boolean) => void
  onMarkAsRead: () => void
  onDelete: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1118]/95 backdrop-blur-md border border-primary-base/30 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl" />
        </div>
        
        <div 
          className="relative z-10 flex-shrink-0 p-8 pb-4 backdrop-blur-md border-b border-primary-base/20"
          style={{
            background: 'linear-gradient(135deg, rgba(48, 169, 217, 0.15) 0%, rgba(2, 56, 89, 0.1) 50%, rgba(48, 169, 217, 0.12) 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {message.subject}
                </h2>
                {message.status === 'new' && (
                  <span className="px-3 py-1 bg-primary-light/20 text-primary-light text-xs rounded-full border border-primary-light/30">Nova</span>
                )}
                {message.is_pinned && (
                  <span className="px-3 py-1 bg-primary-light/30 text-primary-lightest text-xs rounded-full border border-primary-light/40 flex items-center gap-1">
                    <FontAwesomeIcon icon={faThumbtack} className="text-xs" />
                    Anexada
                  </span>
                )}
              </div>
              <p className="text-sm text-primary-lightest/60 mt-1">
                De: {message.name} ({message.email})
              </p>
              <p className="text-xs text-primary-lightest/50 mt-1">
                {new Date(message.created_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-lightest/60 hover:text-white transition-colors hover:scale-110 ml-4"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative z-10 p-8 pt-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary-lightest/60 mb-2 uppercase tracking-wide">Mensagem</h3>
              <div className="bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl p-6">
                <p className="text-primary-lightest/90 whitespace-pre-wrap leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary-base/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTogglePin(!message.is_pinned)}
                  className="px-4 py-2 rounded-lg bg-[#0D1118]/60 border border-primary-base/30 text-primary-light hover:bg-primary-light/20 hover:text-primary-lightest transition-all duration-300 flex items-center gap-2"
                  title={message.is_pinned ? 'Desanexar' : 'Anexar no topo'}
                >
                  <FontAwesomeIcon 
                    icon={faThumbtack} 
                    className={`text-sm transition-all duration-300 ${message.is_pinned ? 'rotate-45' : ''}`}
                  />
                  {message.is_pinned ? 'Desanexar' : 'Anexar'}
                </button>
                {message.status === 'new' && (
                  <button
                    onClick={onMarkAsRead}
                    className="px-4 py-2 rounded-lg bg-[#0D1118]/60 border border-primary-base/30 text-primary-light hover:bg-primary-light/20 hover:text-primary-lightest transition-all duration-300 flex items-center gap-2"
                    title="Marcar como lida"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                    Marcar como lida
                  </button>
                )}
              </div>
              <button
                onClick={onDelete}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 flex items-center gap-2"
                title="Excluir mensagem"
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



