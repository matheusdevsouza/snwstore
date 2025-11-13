export function sanitizeString(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  let sanitized = input
    .replace(/[<>]/g, '') 
    .replace(/javascript:/gi, '') 
    .replace(/on\w+=/gi, '') 
    .trim()

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

export function sanitizeName(name: string): string {
  return sanitizeString(name, 255)
    .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '')
}

export function sanitizeSubject(subject: string): string {
  return sanitizeString(subject, 500)
}

export function sanitizeMessage(message: string): string {
  return sanitizeString(message, 10000) 
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return 'unknown'
}

export function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const { checkRateLimit: checkRateLimitNew } = require('./security')
  const result = checkRateLimitNew(`legacy:${ip}`, maxRequests, windowMs)
  return result.allowed
}

