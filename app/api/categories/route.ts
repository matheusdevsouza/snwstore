import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { sanitizeString } from '@/lib/sanitize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .neq('slug', 'all')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (active === 'true') {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
        count: data?.length || 0
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Categories API error:', error)
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

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name and slug' },
        { status: 400 }
      )
    }

    const categoryData = {
      name: sanitizeString(body.name, 100),
      slug: sanitizeString(body.slug, 100),
      description: body.description ? sanitizeString(body.description, 1000) : null,
      icon: body.icon ? sanitizeString(body.icon, 50) : null,
      display_order: parseInt(body.display_order?.toString() || '0'),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('Category creation error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create category' },
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
    console.error('Category creation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
