import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const bucketName = 'blog-images'

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json(
        { error: 'Failed to check buckets', details: listError.message },
        { status: 500 }
      )
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)
    const bucket = buckets?.find((bucket) => bucket.name === bucketName)

    return NextResponse.json({
      exists: bucketExists,
      bucket: bucket || null,
      bucketName,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      {
        error: 'Unexpected error occurred',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bucketName = 'blog-images'

    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json(
        { error: 'Failed to check existing buckets', details: listError.message },
        { status: 500 }
      )
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

    if (bucketExists) {
      return NextResponse.json({
        message: 'Bucket already exists',
        bucketName,
        exists: true,
      })
    }

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true, // Make bucket public so images can be accessed
      fileSizeLimit: 5242880, // 5MB limit
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    })

    if (error) {
      console.error('Error creating bucket:', error)
      return NextResponse.json(
        { error: 'Failed to create bucket', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Bucket created successfully',
      bucketName,
      data,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      {
        error: 'Unexpected error occurred',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

