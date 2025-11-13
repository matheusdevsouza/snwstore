import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/db'
import { sanitizeString } from '@/lib/sanitize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const includeInactive = searchParams.get('includeInactive') === 'true' 
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (category && category !== 'all') {
      query = query.eq('category_slug', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Products fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products', details: error.message },
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
    console.error('Products API error:', error)
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

    if (!body.name || !body.slug || !body.description || !body.price || !body.image_url || !body.link) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const slug = sanitizeString(body.slug || body.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''), 255)

    const productData = {
      name: sanitizeString(body.name, 255),
      slug: slug,
      description: sanitizeString(body.description, 10000),
      short_description: body.short_description ? sanitizeString(body.short_description, 500) : sanitizeString(body.description, 500).substring(0, 500),
      price: parseFloat(body.price.toString()),
      original_price: body.original_price ? parseFloat(body.original_price.toString()) : null,
      rating: body.rating ? Math.min(5, Math.max(0, parseFloat(body.rating.toString()))) : 0,
      image_url: sanitizeString(body.image_url, 2000),
      link: sanitizeString(body.link, 2000),
      category_id: body.category_id || null,
      category_slug: body.category_slug ? sanitizeString(body.category_slug, 100) : null,
      stock_status: body.stock_status || 'in_stock',
      is_featured: Boolean(body.is_featured),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      display_order: parseInt(body.display_order?.toString() || '0')
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Product creation error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create product' },
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
    console.error('Product creation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

