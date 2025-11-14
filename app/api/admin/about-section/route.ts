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
      .from('about_section_content')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching about section content:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar conteúdo' },
        { status: 500 }
      )
    }

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'about_section_enabled')
      .single()

    let isEnabled = true
    if (settingsData && settingsData.value !== undefined && settingsData.value !== null) {
      isEnabled = settingsData.value === 'true' || settingsData.value === true
    }

    return NextResponse.json({
      success: true,
      data: {
        content: data || [],
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

    console.error('Error in GET /api/admin/about-section:', error)
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
    const { content, enabled } = body

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (typeof enabled === 'boolean') {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'about_section_enabled')
        .single()

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            value: enabled.toString(),
            updated_at: new Date().toISOString()
          })
          .eq('key', 'about_section_enabled')

        if (error) {
          console.error('Error updating about section enabled:', error)
          return NextResponse.json(
            { success: false, error: 'Erro ao atualizar visibilidade' },
            { status: 500 }
          )
        }
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'about_section_enabled',
            value: enabled.toString(),
            description: 'Controla se a seção "Sobre" está visível no site'
          })

        if (error) {
          console.error('Error creating about section enabled:', error)
          return NextResponse.json(
            { success: false, error: 'Erro ao criar configuração' },
            { status: 500 }
          )
        }
      }
    }

    if (Array.isArray(content)) {
      for (const item of content) {
        const { card_key, title, description, additional_description, icon_name, display_order } = item

        if (!card_key || !title || !description || !icon_name) {
          continue
        }

        const sanitizedTitle = sanitizeString(title)
        const sanitizedDescription = sanitizeString(description)
        const sanitizedAdditionalDescription = additional_description ? sanitizeString(additional_description) : null
        const sanitizedIconName = sanitizeString(icon_name)

        const { data: existing } = await supabase
          .from('about_section_content')
          .select('*')
          .eq('card_key', card_key)
          .single()

        if (existing) {
          const { error } = await supabase
            .from('about_section_content')
            .update({
              title: sanitizedTitle,
              description: sanitizedDescription,
              additional_description: sanitizedAdditionalDescription,
              icon_name: sanitizedIconName,
              display_order: display_order || existing.display_order,
              updated_at: new Date().toISOString()
            })
            .eq('card_key', card_key)

          if (error) {
            console.error(`Error updating card ${card_key}:`, error)
          }
        } else {
          const { error } = await supabase
            .from('about_section_content')
            .insert({
              card_key,
              title: sanitizedTitle,
              description: sanitizedDescription,
              additional_description: sanitizedAdditionalDescription,
              icon_name: sanitizedIconName,
              display_order: display_order || 0
            })

          if (error) {
            console.error(`Error creating card ${card_key}:`, error)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Conteúdo atualizado com sucesso'
    })
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.error('Error in PUT /api/admin/about-section:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}


