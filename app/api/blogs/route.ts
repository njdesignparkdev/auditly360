import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/blogs - Fetch blogs with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const publishedOnly = searchParams.get('published_only') === 'true';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blogs')
      .select('*, author:users(id, first_name, last_name, email)', { count: 'exact' });

    // Filter by published status if requested
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Order by published_at or created_at
    query = query.order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: blogs, error, count } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blogs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      blogs: blogs || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Unexpected error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, content, excerpt, featured_image_url, meta_title, meta_description, tags, is_published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingBlog } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      featured_image_url: featured_image_url || null,
      author_id: user.id,
      is_published: is_published || false,
      published_at: is_published ? new Date().toISOString() : null,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || content.substring(0, 160),
      tags: tags || []
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog:', error);
      return NextResponse.json(
        { error: 'Failed to create blog', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      blog: data,
      message: 'Blog created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error creating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

