import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { checkRateLimit, logSecurityEvent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimit = checkRateLimit(`analytics:${ip}`, 100, 60000) 
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        reason: 'Analytics rate limit exceeded',
        ip
      }, request)
      
      return NextResponse.json(
        { success: false, error: 'Muitas requisições. Por favor, aguarde um momento.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      sessionId,
      eventType,
      type,
      productId,
      productName,
      productSlug,
      sectionName,
      buttonName,
      timeSpent,
      scrollDepth,
      eventData,
      url,
      section,
      button,
    } = body

    const normalizedEventType = eventType || type || 'page_view'

    const validEventTypes = [
      'page_view',
      'product_click',
      'product_view',
      'time_on_page',
      'section_view',
      'button_click',
      'form_submit',
      'scroll_depth',
    ]

    if (!validEventTypes.includes(normalizedEventType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      ''

    const logData: any = {
      session_id: sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      event_type: normalizedEventType,
      event_data: eventData || {},
      user_agent: userAgent,
      referrer: referrer || null,
    }

    if (ipAddress && !ipAddress.includes('127.0.0.1') && !ipAddress.includes('::1')) {
      logData.ip_address = ipAddress.split(',')[0].trim()
    }

    if (productId) {
      logData.product_id = productId
    }
    if (productName) {
      logData.product_name = productName
    }
    if (productSlug) {
      logData.product_slug = productSlug
    }
    if (sectionName || section) {
      logData.section_name = sectionName || section
    }
    if (buttonName || button) {
      logData.button_name = buttonName || button
    }
    if (timeSpent !== undefined) {
      logData.time_spent = parseInt(timeSpent.toString())
    }
    if (scrollDepth !== undefined) {
      logData.scroll_depth = parseInt(scrollDepth.toString())
    }

    const { data, error } = await supabaseAdmin
      .from('analytics_logs')
      .insert([logData])
      .select()
      .single()

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Analytics track API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
