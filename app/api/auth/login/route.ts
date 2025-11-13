import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { verifyPassword, generateAccessToken, generateRefreshToken, validatePasswordStrength } from '@/lib/auth'
import { checkRateLimit, logSecurityEvent, validateOrigin } from '@/lib/security'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000

interface LoginAttempt {
  email: string
  attempts: number
  lockoutUntil: number
}

const loginAttempts = new Map<string, LoginAttempt>()

setInterval(() => {
  const now = Date.now()
  for (const [email, attempt] of loginAttempts.entries()) {
    if (attempt.lockoutUntil < now) {
      loginAttempts.delete(email)
    }
  }
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !validateOrigin(request)) {
      logSecurityEvent('unauthorized_access', {
        reason: 'Invalid origin on login',
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

    const rateLimit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000, 30 * 60 * 1000)

    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        reason: 'Login rate limit exceeded',
        ip,
        retryAfter: rateLimit.retryAfter
      }, request)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Muitas tentativas de login. Por favor, tente novamente em alguns minutos.',
          retryAfter: rateLimit.retryAfter
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const attempt = loginAttempts.get(normalizedEmail)
    const now = Date.now()

    if (attempt && attempt.lockoutUntil > now) {
      const remainingMinutes = Math.ceil((attempt.lockoutUntil - now) / (60 * 1000))
      return NextResponse.json(
        {
          success: false,
          error: `Conta bloqueada devido a muitas tentativas falhas. Tente novamente em ${remainingMinutes} minuto(s).`
        },
        { status: 429 }
      )
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, password_hash, is_active')
      .eq('email', normalizedEmail)
      .single()

    if (error || !user) {
      logSecurityEvent('login_failure', {
        reason: 'User not found',
        email: normalizedEmail,
        ip
      }, request)
      
      const currentAttempt = attempt || { email: normalizedEmail, attempts: 0, lockoutUntil: 0 }
      currentAttempt.attempts++

      if (currentAttempt.attempts >= MAX_LOGIN_ATTEMPTS) {
        currentAttempt.lockoutUntil = now + LOCKOUT_DURATION
        loginAttempts.set(normalizedEmail, currentAttempt)
        
        logSecurityEvent('suspicious_activity', {
          reason: 'Account locked due to multiple failed attempts',
          email: normalizedEmail,
          ip
        }, request)
        
        return NextResponse.json(
          {
            success: false,
            error: 'Email ou senha incorretos. Conta bloqueada temporariamente.'
          },
          { status: 401 }
        )
      }

      loginAttempts.set(normalizedEmail, currentAttempt)
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'Conta desativada. Entre em contato com o administrador.' },
        { status: 403 }
      )
    }

    const passwordValid = await verifyPassword(password, user.password_hash)

    if (!passwordValid) {
      logSecurityEvent('login_failure', {
        reason: 'Invalid password',
        email: normalizedEmail,
        userId: user.id,
        ip
      }, request)
      
      const currentAttempt = attempt || { email: normalizedEmail, attempts: 0, lockoutUntil: 0 }
      currentAttempt.attempts++

      if (currentAttempt.attempts >= MAX_LOGIN_ATTEMPTS) {
        currentAttempt.lockoutUntil = now + LOCKOUT_DURATION
        loginAttempts.set(normalizedEmail, currentAttempt)

        await supabaseAdmin
          .from('admin_users')
          .update({ last_login_at: null })
          .eq('id', user.id)

        logSecurityEvent('suspicious_activity', {
          reason: 'Account locked due to multiple failed password attempts',
          email: normalizedEmail,
          userId: user.id,
          ip
        }, request)

        return NextResponse.json(
          {
            success: false,
            error: 'Email ou senha incorretos. Conta bloqueada temporariamente.'
          },
          { status: 401 }
        )
      }

      loginAttempts.set(normalizedEmail, currentAttempt)

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    loginAttempts.delete(normalizedEmail)
    
    logSecurityEvent('login_success', {
      email: normalizedEmail,
      userId: user.id,
      ip
    }, request)

    await supabaseAdmin
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    await supabaseAdmin
      .from('admin_users')
      .update({ 
        refresh_token: refreshToken,
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

    response.cookies.set('admin_access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, 
    })

    response.cookies.set('admin_refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

