import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseConfig {
  supabaseUrl: string
  supabaseServiceKey: string
  supabaseAnonKey: string
}

let configCache: SupabaseConfig | null = null
let supabaseAdminInstance: SupabaseClient | null = null
let supabaseInstance: SupabaseClient | null = null

function getSupabaseConfig(): SupabaseConfig {
  if (configCache) {
    return configCache
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    const error = new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL')
    console.error('[DB Config Error]', error.message)
    console.error('[DB Config Debug] Available env vars:', {
      hasNextPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      nextPublicUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    })
    throw error
  }

  if (!supabaseServiceKey || supabaseServiceKey.trim() === '') {
    const error = new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY')
    console.error('[DB Config Error]', error.message)
    console.error('[DB Config Debug] Available env vars:', {
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
    })
    throw error
  }

  configCache = {
    supabaseUrl: supabaseUrl.trim(),
    supabaseServiceKey: supabaseServiceKey.trim(),
    supabaseAnonKey: (supabaseAnonKey || supabaseServiceKey).trim(),
  }

  return configCache
}

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    const { supabaseUrl, supabaseServiceKey } = getSupabaseConfig()
    supabaseAdminInstance = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdminInstance
}

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

const supabaseAdminProxy = {
  get(target: any, prop: string | symbol) {
    const client = getSupabaseAdmin()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
}

const supabaseProxy = {
  get(target: any, prop: string | symbol) {
    const client = getSupabase()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, supabaseAdminProxy) as SupabaseClient
export const supabase = new Proxy({} as SupabaseClient, supabaseProxy) as SupabaseClient
