-- =====================================================
-- YieldPulse Property Image Storage Setup
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor
-- to enable the property image upload feature
-- =====================================================

-- Step 1: Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'analysis-assets',
  'analysis-assets',
  true,  -- Public bucket so images can be viewed
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Step 2: Create storage policies for security

-- Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'analysis-assets');

-- Allow authenticated users to update their images
CREATE POLICY IF NOT EXISTS "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'analysis-assets');

-- Allow authenticated users to delete their images
CREATE POLICY IF NOT EXISTS "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'analysis-assets');

-- Allow public to view images (needed for displaying in reports)
CREATE POLICY IF NOT EXISTS "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-assets');

-- Step 3: Verify bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'analysis-assets';

-- =====================================================
-- Expected result: You should see one row with:
-- - id: analysis-assets
-- - name: analysis-assets
-- - public: true
-- - file_size_limit: 5242880
-- =====================================================
