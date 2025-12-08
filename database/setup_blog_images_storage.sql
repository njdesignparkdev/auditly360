-- ============================================
-- Setup Storage Bucket for Blog Images
-- ============================================
-- This script sets up the 'blog-images' storage bucket
-- and configures Row Level Security (RLS) policies
--
-- Run this in your Supabase SQL Editor:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run" or press Ctrl+Enter
-- ============================================

-- Note: The bucket itself needs to be created via the Supabase Dashboard or API
-- This script only sets up the policies. If the bucket doesn't exist, create it first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: blog-images
-- 4. Public bucket: Yes (checked)
-- 5. File size limit: 5242880 (5MB)
-- 6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- ============================================
-- Storage Policies for blog-images bucket
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public to read blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to delete blog images" ON storage.objects;

-- Policy: Allow public to read/view blog images
-- This makes images accessible to everyone (for public blog posts)
CREATE POLICY "Allow public to read blog images" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'blog-images' AND
    -- Allow reading any file in the blog-images bucket
    true
  );

-- Policy: Allow authenticated admin users to upload blog images
CREATE POLICY "Allow authenticated admins to upload blog images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    -- Check if user is authenticated and is an admin
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Allow authenticated admin users to update blog images
CREATE POLICY "Allow authenticated admins to update blog images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Allow authenticated admin users to delete blog images
CREATE POLICY "Allow authenticated admins to delete blog images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Alternative: Simpler policies (if you want less restrictive access)
-- ============================================
-- Uncomment these if you want to allow all authenticated users to upload
-- (not just admins)

/*
-- Drop admin-only policies first
DROP POLICY IF EXISTS "Allow authenticated admins to upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to delete blog images" ON storage.objects;

-- Allow any authenticated user to upload
CREATE POLICY "Allow authenticated users to upload blog images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );

-- Allow any authenticated user to update their own uploads
CREATE POLICY "Allow authenticated users to update blog images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );

-- Allow any authenticated user to delete their own uploads
CREATE POLICY "Allow authenticated users to delete blog images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );
*/

-- ============================================
-- Verification Queries (optional - run these to check setup)
-- ============================================

-- Check if bucket exists (run this to verify)
-- SELECT * FROM storage.buckets WHERE name = 'blog-images';

-- Check storage policies (run this to verify policies are created)
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%blog%';

-- ============================================
-- Notes:
-- ============================================
-- 1. Make sure the 'blog-images' bucket is created in Supabase Dashboard
-- 2. Set the bucket to "Public" so images can be accessed via public URLs
-- 3. Recommended settings:
--    - File size limit: 5242880 bytes (5MB)
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 4. The policies above ensure:
--    - Anyone can view/read blog images (public access)
--    - Only authenticated admin users can upload/update/delete images
-- 5. If you need to allow non-admin users to upload, use the alternative policies above

