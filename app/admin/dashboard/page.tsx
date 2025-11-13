'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (!response.ok) {
        router.push('/admin')
        return
      }

      const data = await response.json()

      if (!data.success || !data.user) {
        router.push('/admin')
        return
      }

      setUser(data.user)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1118] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
          <p className="mt-4 text-primary-lightest/70">Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <AdminDashboard user={user} />
}


