import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'


export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: authResult.user?.userId,
          email: authResult.user?.email,
          name: authResult.user?.name,
          role: authResult.user?.role
        }
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}





