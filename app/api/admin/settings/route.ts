import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-middleware'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'testimonials_enabled')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar configurações' },
        { status: 500 }
      )
    }

    let isEnabled = true
    
    if (data && data.value !== undefined && data.value !== null) {
      isEnabled = data.value === 'true' || data.value === true
    }

    return NextResponse.json({
      success: true,
      data: {
        testimonials_enabled: isEnabled
      }
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in GET /api/admin/settings:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth(request)

    const body = await request.json()
    const { testimonials_enabled } = body

    if (typeof testimonials_enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Valor inválido para testimonials_enabled' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existing } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'testimonials_enabled')
      .single()

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({
          value: testimonials_enabled.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('key', 'testimonials_enabled')

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
          { success: false, error: 'Erro ao atualizar configurações' },
          { status: 500 }
        )
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          key: 'testimonials_enabled',
          value: testimonials_enabled.toString(),
          description: 'Controla se a seção de depoimentos está visível no site'
        })

      if (error) {
        console.error('Error creating settings:', error)
        return NextResponse.json(
          { success: false, error: 'Erro ao criar configurações' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in PUT /api/admin/settings:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

