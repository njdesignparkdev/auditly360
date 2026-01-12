-- Create blogs table for managing blog posts
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT blogs_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create index for published blogs
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs (is_published, published_at DESC) WHERE is_published = true;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);

-- Create index for author lookups
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs (author_id);

-- Create index for search (title and content)
CREATE INDEX IF NOT EXISTS idx_blogs_search ON public.blogs USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '')));

-- Add comment
COMMENT ON TABLE public.blogs IS 'Blog posts for the website. Stores title, content, metadata, and publishing status.';

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy to allow public to read published blogs
CREATE POLICY "Allow public to read published blogs" ON public.blogs
  FOR SELECT USING (is_published = true);

-- Policy to allow authenticated users to read all blogs (for admin)
CREATE POLICY "Allow authenticated users to read all blogs" ON public.blogs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow authenticated admins to insert blogs
CREATE POLICY "Allow admins to insert blogs" ON public.blogs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Policy to allow authenticated admins to update blogs
CREATE POLICY "Allow admins to update blogs" ON public.blogs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Policy to allow authenticated admins to delete blogs
CREATE POLICY "Allow admins to delete blogs" ON public.blogs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

