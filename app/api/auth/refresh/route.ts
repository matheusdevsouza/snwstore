import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/db'
import { checkRateLimit, logSecurityEvent, validateOrigin } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !validateOrigin(request)) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Invalid origin on refresh',
        path: request.nextUrl.pathname
      }, request)
      
      return NextResponse.json(
        { success: false, error: 'Origem não autorizada' },
        { status: 403 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimit = checkRateLimit(`refresh:${ip}`, 10, 60000) 
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        reason: 'Refresh token rate limit exceeded',
        ip
      }, request)
      
      return NextResponse.json(
        { success: false, error: 'Muitas tentativas de refresh. Por favor, aguarde.' },
        { status: 429 }
      )
    }

    const refreshToken = request.cookies.get('admin_refresh_token')?.value

    if (!refreshToken) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Missing refresh token',
        path: request.nextUrl.pathname
      }, request)
      
      return NextResponse.json(
        { success: false, error: 'Refresh token não encontrado' },
        { status: 401 }
      )
    }

    const payload = await verifyRefreshToken(refreshToken)

    if (!payload) {
      const response = NextResponse.json(
        { success: false, error: 'Refresh token inválido ou expirado' },
        { status: 401 }
      )
      response.cookies.delete('admin_access_token')
      response.cookies.delete('admin_refresh_token')
      return response
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, refresh_token, refresh_token_expires_at')
      .eq('id', payload.userId)
      .single()

    if (error || !user || !user.is_active) {
      const response = NextResponse.json(
        { success: false, error: 'Usuário não encontrado ou inativo' },
        { status: 401 }
      )
      response.cookies.delete('admin_access_token')
      response.cookies.delete('admin_refresh_token')
      return response
    }

    if (user.refresh_token !== refreshToken) {
      const response = NextResponse.json(
        { success: false, error: 'Refresh token inválido' },
        { status: 401 }
      )
      response.cookies.delete('admin_access_token')
      response.cookies.delete('admin_refresh_token')
      return response
    }

    if (!user.refresh_token_expires_at || new Date(user.refresh_token_expires_at) < new Date()) {
      const response = NextResponse.json(
        { success: false, error: 'Refresh token expirado' },
        { status: 401 }
      )
      response.cookies.delete('admin_access_token')
      response.cookies.delete('admin_refresh_token')
      return response
    }

    const newAccessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const newRefreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    await supabaseAdmin
      .from('admin_users')
      .update({
        refresh_token: newRefreshToken,
        refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('id', user.id)

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    )

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    }

    response.cookies.set('admin_access_token', newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, 
    })

    response.cookies.set('admin_refresh_token', newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, 
    })

    return response

  } catch (error: any) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

