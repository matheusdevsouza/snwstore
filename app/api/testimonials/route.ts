import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/db'
import { sanitizeString, sanitizeName } from '@/lib/sanitize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let isAuthenticated = false
    try {
      const { requireAuth } = await import('@/lib/auth-middleware')
      const authResult = await requireAuth(request)
      isAuthenticated = authResult.authorized
    } catch {
      isAuthenticated = false
    }

    const shouldFilterActive = !isAuthenticated && !includeInactive

    let query = supabaseAdmin
      .from('testimonials')
      .select('*')

    if (shouldFilterActive) {
      query = query.eq('is_active', true)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Testimonials fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonials', details: error.message },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      )
    }

    if (shouldFilterActive) {
      console.log(`[Testimonials API] Filtered active only. Found ${data?.length || 0} active testimonials`)
      const inactiveCount = data?.filter((t: any) => !t.is_active).length || 0
      if (inactiveCount > 0) {
        console.warn(`[Testimonials API] WARNING: ${inactiveCount} inactive testimonials found despite filter!`)
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
        count: data?.length || 0
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )

  } catch (error: any) {
    console.error('Testimonials API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth-middleware')
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (!body.name || !body.role || !body.rating || !body.text || !body.avatar_url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonialData = {
      name: sanitizeName(body.name),
      role: sanitizeString(body.role, 255),
      rating: Math.min(5, Math.max(1, parseInt(body.rating.toString()))),
      text: sanitizeString(body.text, 5000),
      avatar_url: sanitizeString(body.avatar_url, 2000),
      is_featured: Boolean(body.is_featured),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      display_order: parseInt(body.display_order?.toString() || '0')
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single()

    if (error) {
      console.error('Testimonial creation error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Testimonial creation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

