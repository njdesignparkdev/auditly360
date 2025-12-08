-- ============================================
-- Blog Images Storage - Helper Queries
-- ============================================
-- Useful queries for managing and verifying the blog-images storage bucket
-- Run these in your Supabase SQL Editor as needed
-- ============================================

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check if the blog-images bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at,
  updated_at
FROM storage.buckets 
WHERE name = 'blog-images';

-- 2. List all storage policies for blog-images bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%blog%'
ORDER BY policyname;

-- 3. Count total files in blog-images bucket
SELECT COUNT(*) as total_files
FROM storage.objects
WHERE bucket_id = 'blog-images';

-- 4. List all files in blog-images bucket (with metadata)
SELECT 
  id,
  name,
  bucket_id,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'blog-images'
ORDER BY created_at DESC
LIMIT 100;

-- 5. Get total storage size used by blog-images
SELECT 
  SUM((metadata->>'size')::bigint) as total_size_bytes,
  pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size_pretty
FROM storage.objects
WHERE bucket_id = 'blog-images';

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- 6. Find orphaned images (images not referenced in blogs table)
-- Note: This requires the featured_image_url to match the storage path
SELECT 
  o.id,
  o.name,
  o.created_at,
  o.metadata
FROM storage.objects o
WHERE o.bucket_id = 'blog-images'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.blogs b
    WHERE b.featured_image_url LIKE '%' || o.name || '%'
  )
ORDER BY o.created_at DESC;

-- 7. Find images older than 90 days (for cleanup)
SELECT 
  id,
  name,
  created_at,
  (NOW() - created_at) as age
FROM storage.objects
WHERE bucket_id = 'blog-images'
  AND created_at < NOW() - INTERVAL '90 days'
ORDER BY created_at ASC;

-- 8. Find large files (> 4MB) in blog-images bucket
SELECT 
  id,
  name,
  (metadata->>'size')::bigint as size_bytes,
  pg_size_pretty((metadata->>'size')::bigint) as size_pretty,
  created_at
FROM storage.objects
WHERE bucket_id = 'blog-images'
  AND (metadata->>'size')::bigint > 4194304  -- 4MB
ORDER BY (metadata->>'size')::bigint DESC;

-- ============================================
-- POLICY MANAGEMENT QUERIES
-- ============================================

-- 9. View all storage policies (not just blog-images)
SELECT 
  policyname,
  cmd as operation,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;

-- 10. Check which users have uploaded images
SELECT 
  owner,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::bigint) as total_size_bytes
FROM storage.objects
WHERE bucket_id = 'blog-images'
GROUP BY owner
ORDER BY file_count DESC;

-- ============================================
-- CLEANUP QUERIES (Use with caution!)
-- ============================================

-- 11. Delete a specific file by name (replace 'filename.jpg' with actual filename)
-- WARNING: This permanently deletes the file!
/*
DELETE FROM storage.objects
WHERE bucket_id = 'blog-images'
  AND name = 'filename.jpg';
*/

-- 12. Delete files older than 90 days (uncomment to use)
-- WARNING: This permanently deletes old files!
/*
DELETE FROM storage.objects
WHERE bucket_id = 'blog-images'
  AND created_at < NOW() - INTERVAL '90 days';
*/

-- ============================================
-- BUCKET SETTINGS QUERY
-- ============================================

-- 13. Update bucket settings (if needed)
-- Note: Most bucket settings need to be changed via Dashboard or API
-- This query shows current settings
SELECT 
  name,
  id,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name = 'blog-images';

-- ============================================
-- USAGE STATISTICS
-- ============================================

-- 14. Get upload statistics by date
SELECT 
  DATE(created_at) as upload_date,
  COUNT(*) as files_uploaded,
  SUM((metadata->>'size')::bigint) as total_size_bytes,
  pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size_pretty
FROM storage.objects
WHERE bucket_id = 'blog-images'
GROUP BY DATE(created_at)
ORDER BY upload_date DESC
LIMIT 30;

-- 15. Get file type distribution
SELECT 
  CASE 
    WHEN name LIKE '%.jpg' OR name LIKE '%.jpeg' THEN 'JPEG'
    WHEN name LIKE '%.png' THEN 'PNG'
    WHEN name LIKE '%.gif' THEN 'GIF'
    WHEN name LIKE '%.webp' THEN 'WebP'
    ELSE 'Other'
  END as file_type,
  COUNT(*) as count,
  SUM((metadata->>'size')::bigint) as total_size_bytes,
  pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size_pretty
FROM storage.objects
WHERE bucket_id = 'blog-images'
GROUP BY file_type
ORDER BY count DESC;

