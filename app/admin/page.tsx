'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEnvelope, faUser, faSnowflake } from '@fortawesome/free-solid-svg-icons'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setIsAuthenticated(true)
          router.push('/admin/dashboard')
          return
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao fazer login')
        setIsSubmitting(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()

    } catch (error: any) {
      console.error('Login error:', error)
      setError('Erro ao conectar com o servidor. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0D1118] flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            <p className="mt-4 text-primary-lightest/70">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <div className="h-screen bg-[#0D1118] flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 relative flex items-center justify-center px-4 py-12">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-lightest/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="bg-gradient-to-br from-[#0D1118]/90 to-[#0D1118]/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-base/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-4">
                  <Image
                    src="/snow-logo.png"
                    alt="SNW Store Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Painel Administrativo
                </h1>
                <p className="text-primary-lightest/60 text-sm flex items-center justify-center gap-2">
                  Acesso restrito a administradores
                  <FontAwesomeIcon icon={faSnowflake} className="text-primary-light/60" />
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="text-primary-light/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary-lightest/80 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className="text-primary-light/50" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                      className="w-full pl-12 pr-4 py-3 bg-[#0D1118]/50 border border-primary-base/30 rounded-xl text-white placeholder-primary-lightest/40 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary w-full py-4 px-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-primary-base/20">
                <p className="text-xs text-primary-lightest/40 text-center">
                  Apenas administradores autorizados podem acessar este painel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}


