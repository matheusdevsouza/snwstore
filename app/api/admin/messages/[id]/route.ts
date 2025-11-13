import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { supabaseAdmin } from '@/lib/db'

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

    const { id } = params
    const body = await request.json()
    const { status, is_pinned } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'read' && !body.read_at) {
        updateData.read_at = new Date().toISOString()
      }
    }

    if (is_pinned !== undefined) {
      updateData.is_pinned = is_pinned
    }

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Message update error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Mensagem atualizada com sucesso',
        data: data
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Message update API error:', error)
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

    const { id } = params

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Message delete error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Mensagem excluída com sucesso'
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Message delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

