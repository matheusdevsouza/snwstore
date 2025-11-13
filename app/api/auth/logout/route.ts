import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { supabaseAdmin } from '@/lib/db'


export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (authResult.authorized && authResult.user) {
      await supabaseAdmin
        .from('admin_users')
        .update({ 
          refresh_token: null,
          refresh_token_expires_at: null
        })
        .eq('id', authResult.user.userId)
    }

    const response = NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    )

    response.cookies.delete('admin_access_token')
    response.cookies.delete('admin_refresh_token')

    return response

  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}





