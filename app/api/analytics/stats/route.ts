import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
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

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const eventType = searchParams.get('eventType')

    let query = supabaseAdmin
      .from('analytics_logs')
      .select('*', { count: 'exact' })

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    query = query.order('created_at', { ascending: false })

    query = query.limit(1000)

    const { data: logs, error, count } = await query

    if (error) {
      console.error('Analytics stats error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const stats = {
      totalEvents: count || 0,
      uniqueSessions: new Set(logs?.map(log => log.session_id) || []).size,
      eventTypes: {} as Record<string, number>,
      productClicks: [] as any[],
      sectionViews: [] as any[],
      averageTimeSpent: 0,
      totalTimeSpent: 0,
      scrollDepthStats: {
        '25%': 0,
        '50%': 0,
        '75%': 0,
        '100%': 0,
      },
    }

    const timeSpentValues: number[] = []
    const productClickMap = new Map<string, { count: number; productName: string; productSlug?: string }>()
    const sectionViewMap = new Map<string, number>()

    logs?.forEach((log: any) => {
      stats.eventTypes[log.event_type] = (stats.eventTypes[log.event_type] || 0) + 1

      if (log.time_spent) {
        timeSpentValues.push(log.time_spent)
        stats.totalTimeSpent += log.time_spent
      }

      if (log.scroll_depth) {
        if (log.scroll_depth >= 25 && log.scroll_depth < 50) {
          stats.scrollDepthStats['25%']++
        } else if (log.scroll_depth >= 50 && log.scroll_depth < 75) {
          stats.scrollDepthStats['50%']++
        } else if (log.scroll_depth >= 75 && log.scroll_depth < 100) {
          stats.scrollDepthStats['75%']++
        } else if (log.scroll_depth >= 100) {
          stats.scrollDepthStats['100%']++
        }
      }

      if (log.event_type === 'product_click' && log.product_id) {
        const key = log.product_id
        const existing = productClickMap.get(key) || { count: 0, productName: log.product_name || 'Desconhecido', productSlug: log.product_slug }
        productClickMap.set(key, {
          ...existing,
          count: existing.count + 1,
        })
      }

      if (log.event_type === 'section_view' && log.section_name) {
        sectionViewMap.set(log.section_name, (sectionViewMap.get(log.section_name) || 0) + 1)
      }
    })

    if (timeSpentValues.length > 0) {
      stats.averageTimeSpent = Math.round(stats.totalTimeSpent / timeSpentValues.length)
    }

    stats.productClicks = Array.from(productClickMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.productName,
        productSlug: data.productSlug,
        clicks: data.count,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20) 

    stats.sectionViews = Array.from(sectionViewMap.entries())
      .map(([sectionName, views]) => ({
        sectionName,
        views,
      }))
      .sort((a, b) => b.views - a.views)

    return NextResponse.json(
      {
        success: true,
        data: {
          logs: logs || [],
          stats,
        },
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Analytics stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

