import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/db'
import { sanitizeString } from '@/lib/sanitize'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { requireAuth } = await import('@/lib/auth-middleware')
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = sanitizeString(body.name, 255)
    if (body.slug !== undefined) updateData.slug = sanitizeString(body.slug, 255)
    if (body.description !== undefined) updateData.description = sanitizeString(body.description, 10000)
    if (body.short_description !== undefined) updateData.short_description = sanitizeString(body.short_description, 500)
    if (body.price !== undefined) updateData.price = parseFloat(body.price.toString())
    if (body.original_price !== undefined) updateData.original_price = body.original_price ? parseFloat(body.original_price.toString()) : null
    if (body.rating !== undefined) updateData.rating = Math.min(5, Math.max(0, parseFloat(body.rating.toString())))
    if (body.image_url !== undefined) updateData.image_url = sanitizeString(body.image_url, 2000)
    if (body.link !== undefined) updateData.link = sanitizeString(body.link, 2000)
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.category_slug !== undefined) updateData.category_slug = sanitizeString(body.category_slug, 100)
    if (body.stock_status !== undefined) updateData.stock_status = body.stock_status
    if (body.is_featured !== undefined) updateData.is_featured = Boolean(body.is_featured)
    if (body.is_active !== undefined) updateData.is_active = Boolean(body.is_active)
    if (body.display_order !== undefined) updateData.display_order = parseInt(body.display_order?.toString() || '0')

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Product update error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Product update API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { requireAuth } = await import('@/lib/auth-middleware')
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = params

    const { data, error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Product delete error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
        data: data
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Product delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

