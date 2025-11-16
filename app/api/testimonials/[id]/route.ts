import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/db'
import { sanitizeString, sanitizeName } from '@/lib/sanitize'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
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
    console.error('Testimonial fetch error:', error)
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
    
    if (body.name !== undefined) updateData.name = sanitizeName(body.name)
    if (body.role !== undefined) updateData.role = sanitizeString(body.role, 255)
    if (body.rating !== undefined) {
      if (body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be between 1 and 5' },
          { status: 400 }
        )
      }
      updateData.rating = Math.min(5, Math.max(1, parseInt(body.rating.toString())))
    }
    if (body.text !== undefined) updateData.text = sanitizeString(body.text, 5000)
    if (body.avatar_url !== undefined) updateData.avatar_url = sanitizeString(body.avatar_url, 2000)
    if (body.is_featured !== undefined) updateData.is_featured = Boolean(body.is_featured)
    if (body.is_active !== undefined) updateData.is_active = Boolean(body.is_active)
    if (body.display_order !== undefined) updateData.display_order = parseInt(body.display_order?.toString() || '0')

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Testimonial update error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update testimonial' },
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
    console.error('Testimonial update API error:', error)
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
      .from('testimonials')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Testimonial delete error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Testimonial deleted successfully',
        data: data
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Testimonial delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

