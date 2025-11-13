import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'
import { sanitizeString } from '@/lib/sanitize'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Category fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Category not found', details: error.message },
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
    console.error('Category API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = sanitizeString(body.name, 100)
    if (body.slug !== undefined) updateData.slug = sanitizeString(body.slug, 100)
    if (body.description !== undefined) updateData.description = body.description ? sanitizeString(body.description, 1000) : null
    if (body.icon !== undefined) updateData.icon = body.icon ? sanitizeString(body.icon, 50) : null
    if (body.display_order !== undefined) updateData.display_order = parseInt(body.display_order?.toString() || '0')
    if (body.is_active !== undefined) updateData.is_active = Boolean(body.is_active)

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Category update error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update category' },
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
    console.error('Category update API error:', error)
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
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Category deletion error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete category' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully'
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Category deletion API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

