import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from './auth'
import { supabaseAdmin } from './db'
import { validateOrigin, logSecurityEvent } from './security'

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export async function requireAuth(request: NextRequest): Promise<{ authorized: boolean; user?: any; response?: NextResponse }> {
  try {
    if (process.env.NODE_ENV === 'production' && !validateOrigin(request)) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Invalid origin',
        path: request.nextUrl.pathname
      }, request)
      
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Origem não autorizada' },
          { status: 403 }
        )
      }
    }

    const accessToken = request.cookies.get('admin_access_token')?.value

    if (!accessToken) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Missing access token',
        path: request.nextUrl.pathname
      }, request)
      
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Não autenticado' },
          { status: 401 }
        )
      }
    }

    const payload = await verifyAccessToken(accessToken)

    if (!payload) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Invalid or expired token',
        path: request.nextUrl.pathname
      }, request)
      
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Token inválido ou expirado' },
          { status: 401 }
        )
      }
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('id', payload.userId)
      .single()

    if (error || !user || !user.is_active) {
      logSecurityEvent('unauthorized_access', {
        reason: 'User not found or inactive',
        userId: payload.userId,
        path: request.nextUrl.pathname
      }, request)
      
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Usuário não encontrado ou inativo' },
          { status: 401 }
        )
      }
    }

    return {
      authorized: true,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Erro de autenticação' },
        { status: 500 }
      )
    }
  }
}

export async function requireAdmin(request: NextRequest): Promise<{ authorized: boolean; user?: any; response?: NextResponse }> {
  const authResult = await requireAuth(request)

  if (!authResult.authorized) {
    return authResult
  }

  if (authResult.user?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Acesso negado. Requer permissões de administrador.' },
        { status: 403 }
      )
    }
  }

  return authResult
}
