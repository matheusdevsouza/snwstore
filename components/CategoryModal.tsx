'use client'

import { useState } from 'react'

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

interface CategoryModalProps {
  category: Category | null
  onClose: () => void
  onSave: () => void
}

export default function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    display_order: category?.display_order?.toString() || '0',
    is_active: category?.is_active !== undefined ? category.is_active : true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      setError('Nome e slug são obrigatórios')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories'
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          display_order: parseInt(formData.display_order)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao salvar categoria')
        setIsSubmitting(false)
        return
      }

      onSave()
    } catch (error: any) {
      setError('Erro ao salvar categoria')
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
                {category ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <p className="text-sm text-primary-lightest/60 mt-1">
                {category ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para os produtos'}
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                placeholder="smartphones"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Descrição</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 resize-none transition-all duration-300"
              placeholder="Descrição da categoria"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-lightest/80 mb-2">Ordem de Exibição</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1118]/60 backdrop-blur-sm border border-primary-base/30 rounded-xl text-white focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-6 pt-8">
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

