import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'testimonials_enabled')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          enabled: true
        })
      }
      console.error('Error fetching testimonials setting:', error)
      return NextResponse.json({
        success: true,
        enabled: true
      })
    }

    let isEnabled = true
    
    if (data && data.value !== undefined && data.value !== null) {
      isEnabled = data.value === 'true' || data.value === true
    }

    console.log('Testimonials setting - data:', data, 'value:', data?.value, 'isEnabled:', isEnabled)

    return NextResponse.json({
      success: true,
      enabled: isEnabled
    })
  } catch (error) {
    console.error('Error in GET /api/settings/testimonials-enabled:', error)
    return NextResponse.json({
      success: true,
      enabled: true
    })
  }
}

