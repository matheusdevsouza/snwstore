import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-middleware'
import { sanitizeString } from '@/lib/sanitize'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching contact info:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar informações de contato' },
        { status: 500 }
      )
    }

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'contact_section_enabled')
      .single()

    let isEnabled = true
    if (settingsData && settingsData.value !== undefined && settingsData.value !== null) {
      isEnabled = settingsData.value === 'true' || settingsData.value === true
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        enabled: isEnabled
      }
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in GET /api/admin/contact-info:', error)
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
    const { items, enabled } = body

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (typeof enabled === 'boolean') {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'contact_section_enabled')
        .single()

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            value: enabled.toString(),
            updated_at: new Date().toISOString()
          })
          .eq('key', 'contact_section_enabled')

        if (error) {
          console.error('Error updating contact section enabled:', error)
          return NextResponse.json(
            { success: false, error: 'Erro ao atualizar visibilidade' },
            { status: 500 }
          )
        }
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'contact_section_enabled',
            value: enabled.toString(),
            description: 'Controla se a seção "Contato" está visível no site'
          })

        if (error) {
          console.error('Error creating contact section enabled:', error)
          return NextResponse.json(
            { success: false, error: 'Erro ao criar configuração' },
            { status: 500 }
          )
        }
      }
    }

    if (Array.isArray(items)) {
      const activeItems = items.filter((item: any) => item.is_active)
      if (activeItems.length > 6) {
        return NextResponse.json(
          { success: false, error: 'Máximo de 6 itens ativos permitidos.' },
          { status: 400 }
        )
      }

      for (const item of items) {
        const { id, title, description, icon_name, link, display_order, is_active } = item

        if (!title || !description || !icon_name) {
          continue
        }

        const sanitizedTitle = sanitizeString(title)
        const sanitizedDescription = sanitizeString(description)
        const sanitizedIconName = sanitizeString(icon_name)
        const sanitizedLink = link ? sanitizeString(link) : null

        if (id) {
          const { error } = await supabase
            .from('contact_info')
            .update({
              title: sanitizedTitle,
              description: sanitizedDescription,
              icon_name: sanitizedIconName,
              link: sanitizedLink,
              display_order: display_order || 0,
              is_active: is_active !== undefined ? is_active : true,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)

          if (error) {
            console.error(`Error updating contact info ${id}:`, error)
          }
        } else {
          const { error } = await supabase
            .from('contact_info')
            .insert({
              title: sanitizedTitle,
              description: sanitizedDescription,
              icon_name: sanitizedIconName,
              link: sanitizedLink,
              display_order: display_order || 0,
              is_active: is_active !== undefined ? is_active : true
            })

          if (error) {
            console.error(`Error creating contact info:`, error)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Informações de contato atualizadas com sucesso'
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in PUT /api/admin/contact-info:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID não fornecido' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('contact_info')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact info:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao excluir informação de contato' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Informação de contato excluída com sucesso'
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in DELETE /api/admin/contact-info:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

