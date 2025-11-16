import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('about_section_content')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching about section content:', error)
      return NextResponse.json({
        success: true,
        content: []
      })
    }

    return NextResponse.json({
      success: true,
      content: data || []
    })
  } catch (error) {
    console.error('Error in GET /api/settings/about-section-content:', error)
    return NextResponse.json({
      success: true,
      content: []
    })
  }
}






