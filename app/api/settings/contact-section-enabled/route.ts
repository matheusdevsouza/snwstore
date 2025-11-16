import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'contact_section_enabled')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching contact section enabled:', error)
      return NextResponse.json({
        success: true,
        enabled: true
      })
    }

    let isEnabled = true
    
    if (data && data.value !== undefined && data.value !== null) {
      isEnabled = data.value === 'true' || data.value === true
    }

    return NextResponse.json({
      success: true,
      enabled: isEnabled
    })
  } catch (error) {
    console.error('Error in GET /api/settings/contact-section-enabled:', error)
    return NextResponse.json({
      success: true,
      enabled: true
    })
  }
}






