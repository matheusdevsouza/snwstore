import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live", 
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co blob:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    
    if (request.nextUrl.pathname.startsWith('/api/admin') || 
        request.nextUrl.pathname.startsWith('/api/auth') ||
        request.nextUrl.pathname.startsWith('/api/upload') ||
        request.nextUrl.pathname.startsWith('/api/products') ||
        request.nextUrl.pathname.startsWith('/api/testimonials') ||
        request.nextUrl.pathname.startsWith('/api/categories') ||
        request.nextUrl.pathname.startsWith('/api/analytics')) {
      
      const origin = request.headers.get('origin')
      const referer = request.headers.get('referer')
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'https://localhost:3000',
      ]

      if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
        if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
          return new NextResponse(
            JSON.stringify({ success: false, error: 'Origem não autorizada' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

