import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret-in-production'
const JWT_EXPIRES_IN = '15m'
const JWT_REFRESH_EXPIRES_IN = '7d'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
}

export interface TokenPayload extends jose.JWTPayload {
  userId: string
  email: string
  role: string
}

let secretKey: Uint8Array | null = null
let refreshSecretKey: Uint8Array | null = null

function getSecretKey(): Uint8Array {
  if (!secretKey) {
    const encoder = new TextEncoder()
    secretKey = encoder.encode(JWT_SECRET)
  }
  return secretKey
}

function getRefreshSecretKey(): Uint8Array {
  if (!refreshSecretKey) {
    const encoder = new TextEncoder()
    refreshSecretKey = encoder.encode(JWT_REFRESH_SECRET)
  }
  return refreshSecretKey
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  const secret = getSecretKey()
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('snow-store-admin')
    .setAudience('snow-store-admin-panel')
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
  
  return jwt
}

export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  const secret = getRefreshSecretKey()
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('snow-store-admin')
    .setAudience('snow-store-admin-panel')
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .sign(secret)
  
  return jwt
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getSecretKey()
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'snow-store-admin',
      audience: 'snow-store-admin-panel'
    })
    
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getRefreshSecretKey()
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'snow-store-admin',
      audience: 'snow-store-admin-panel'
    })
    
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Senha deve ter pelo menos 12 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
