import { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
  blockDurationMs?: number
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000)
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }

  entry.count++

  if (entry.count > maxRequests) {
    if (blockDurationMs) {
      entry.blockedUntil = now + blockDurationMs
    }
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    }
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
  ]

  if (process.env.NODE_ENV === 'development') {
    return true
  }

  if (origin) {
    return allowedOrigins.some(allowed => origin.startsWith(allowed))
  }

  if (referer) {
    return allowedOrigins.some(allowed => referer.startsWith(allowed))
  }

  return false
}

export function validateCSRFToken(request: NextRequest, token?: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  if (!token) {
    return false
  }

  const cookieToken = request.cookies.get('csrf_token')?.value
  if (!cookieToken || cookieToken !== token) {
    return false
  }

  return true
}

export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function validateFileSize(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
  const maxSize = maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`
    }
  }
  return { valid: true }
}

export async function validateFileType(file: File, allowedTypes: string[]): Promise<{ valid: boolean; error?: string }> {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${file.type}`
    }
  }

  if (file.type.startsWith('image/')) {
    const arrayBuffer = await file.slice(0, 12).arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      if (bytes[0] !== 0xFF || bytes[1] !== 0xD8 || bytes[2] !== 0xFF) {
        return {
          valid: false,
          error: 'Arquivo JPEG inválido ou corrompido'
        }
      }
    }
    
    if (file.type === 'image/png') {
      const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
      if (!pngSignature.every((byte, i) => bytes[i] === byte)) {
        return {
          valid: false,
          error: 'Arquivo PNG inválido ou corrompido'
        }
      }
    }
    
    if (file.type === 'image/gif') {
      if (bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x38) {
        return {
          valid: false,
          error: 'Arquivo GIF inválido ou corrompido'
        }
      }
    }
    
    if (file.type === 'image/webp') {
      const webpSignature = new TextDecoder().decode(bytes.slice(0, 4))
      if (webpSignature !== 'RIFF') {
        return {
          valid: false,
          error: 'Arquivo WEBP inválido ou corrompido'
        }
      }
    }
  }

  return { valid: true }
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255)
}

export function logSecurityEvent(
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'unauthorized_access' | 'rate_limit_exceeded' | 'suspicious_activity',
  details: Record<string, any>,
  request: NextRequest
) {
  const logEntry = {
    type,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: request.url,
    method: request.method,
    ...details
  }

  if (process.env.NODE_ENV === 'production') {
    console.log('[SECURITY]', JSON.stringify(logEntry))
  } else {
    console.log('[SECURITY]', logEntry)
  }
}

