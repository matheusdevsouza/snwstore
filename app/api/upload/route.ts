import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'
import { validateFileSize, validateFileType, sanitizeFileName, logSecurityEvent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (!authResult.authorized) {
      return authResult.response || NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const sizeValidation = validateFileSize(file, 5)
    if (!sizeValidation.valid) {
      logSecurityEvent('suspicious_activity', {
        reason: 'File size exceeded',
        fileName: file.name,
        fileSize: file.size
      }, request)
      
      return NextResponse.json(
        { success: false, error: sizeValidation.error },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const typeValidation = await validateFileType(file, allowedTypes)
    if (!typeValidation.valid) {
      logSecurityEvent('suspicious_activity', {
        reason: 'Invalid file type',
        fileName: file.name,
        fileType: file.type
      }, request)
      
      return NextResponse.json(
        { success: false, error: typeValidation.error },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeFileName(file.name)
    const fileExt = sanitizedName.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const referer = request.headers.get('referer') || ''
    const isProduct = referer.includes('products') || referer.includes('produto')
    const filePath = isProduct ? `products/${fileName}` : `testimonials/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const bucketName = 'uploads'
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      
      if (error.message?.includes('Bucket not found') || error.statusCode === '404' || error.status === 400) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Bucket de armazenamento não encontrado. Por favor, execute o script SQL em supabase/create-storage-bucket.sql no Supabase SQL Editor para criar o bucket "uploads".',
            details: error.message,
            instructions: 'Execute o script create-storage-bucket.sql no Supabase SQL Editor ou crie o bucket manualmente no Dashboard > Storage > New bucket com o nome "uploads"'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Erro ao fazer upload da imagem', details: error.message },
        { status: 500 }
      )
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: filePath
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

