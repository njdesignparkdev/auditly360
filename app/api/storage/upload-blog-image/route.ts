import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify user
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Invalid authentication token',
          code: 'INVALID_AUTH',
          details: authError?.message || 'Token verification failed',
        },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'Admin access required',
          code: 'FORBIDDEN',
          details: 'Only admin users can upload blog images',
        },
        { status: 403 }
      )
    }

    // Get the file from form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', code: 'MISSING_FILE' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          code: 'INVALID_TYPE',
          details: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: 'File too large',
          code: 'FILE_TOO_LARGE',
          details: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum of 5MB`,
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = fileName

    // Convert File to Blob for upload (Supabase storage expects Blob or File)
    const fileBlob = new Blob([await file.arrayBuffer()], { type: file.type })

    // Upload using admin client (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(filePath, fileBlob, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        {
          error: 'Failed to upload image',
          code: 'UPLOAD_FAILED',
          details: uploadError.message,
          fullError: uploadError,
        },
        { status: 500 }
      )
    }

    // Verify upload was successful - check if file exists in storage
    if (!uploadData || !uploadData.path) {
      console.error('Upload returned no data:', uploadData)
      return NextResponse.json(
        {
          error: 'Upload completed but no file data returned',
          code: 'UPLOAD_NO_DATA',
          details: 'The upload appeared to succeed but no file information was returned',
        },
        { status: 500 }
      )
    }

    // Verify file actually exists by trying to list it
    const { data: fileList, error: listError } = await supabaseAdmin.storage
      .from('blog-images')
      .list('', {
        limit: 1000,
        search: filePath,
      })

    if (listError) {
      console.error('Error verifying file exists:', listError)
      // Don't fail here, just log - the file might still be there
    } else {
      const fileExists = fileList?.some((f) => f.name === filePath)
      if (!fileExists) {
        console.error('File not found in storage after upload:', filePath)
        return NextResponse.json(
          {
            error: 'File upload failed - file not found in storage',
            code: 'FILE_NOT_FOUND',
            details: 'The upload appeared to succeed but the file cannot be found in storage',
            path: filePath,
          },
          { status: 500 }
        )
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('blog-images').getPublicUrl(filePath)

    if (!publicUrl) {
      return NextResponse.json(
        {
          error: 'Upload successful but failed to get public URL',
          code: 'URL_GENERATION_FAILED',
        },
        { status: 500 }
      )
    }

    // Verify the URL is accessible by checking if we can get file info
    try {
      const { data: fileInfo, error: infoError } = await supabaseAdmin.storage
        .from('blog-images')
        .list('', {
          limit: 1,
          search: filePath,
        })

      if (infoError) {
        console.warn('Warning: Could not verify file info:', infoError)
      }
    } catch (verifyError) {
      console.warn('Warning: File verification check failed:', verifyError)
      // Don't fail the upload, just log the warning
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
      type: file.type,
      verified: true,
    })
  } catch (err) {
    console.error('Unexpected error in upload:', err)
    return NextResponse.json(
      {
        error: 'Unexpected error occurred',
        code: 'INTERNAL_ERROR',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

