import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { sanitizeName, sanitizeSubject, sanitizeMessage, validateEmail, getClientIP } from '@/lib/sanitize'
import { checkRateLimit, logSecurityEvent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60000, 5 * 60 * 1000) 
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        reason: 'Contact form rate limit exceeded',
        ip,
        retryAfter: rateLimit.retryAfter
      }, request)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Muitas tentativas. Por favor, aguarde um minuto.',
          retryAfter: rateLimit.retryAfter
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeName(name)
    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome inválido' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    const sanitizedSubject = sanitizeSubject(subject)
    if (!sanitizedSubject || sanitizedSubject.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Assunto inválido' },
        { status: 400 }
      )
    }

    const sanitizedMessage = sanitizeMessage(message)
    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Mensagem muito curta (mínimo 10 caracteres)' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent') || ''
    const clientIP = getClientIP(request)

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name: sanitizedName,
        email: email.toLowerCase().trim(),
        subject: sanitizedSubject,
        message: sanitizedMessage,
        ip_address: clientIP,
        user_agent: userAgent.substring(0, 500), 
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Contact message insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar mensagem. Por favor, tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        data: { id: data.id }
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
