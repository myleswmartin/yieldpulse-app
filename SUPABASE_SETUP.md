# Supabase Setup for Property Image Feature

## Required Setup Steps

The property image upload feature requires a storage bucket in Supabase. Follow these steps to set it up:

### Option 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Navigate to: https://app.supabase.com/project/YOUR_PROJECT_ID

2. **Create the Storage Bucket**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"
   - Bucket name: `analysis-assets`
   - **Important**: Make sure "Public bucket" is CHECKED (toggle on)
   - Click "Create bucket"

3. **Set up Storage Policies** (for security)
   - Click on the `analysis-assets` bucket
   - Go to "Policies" tab
   - Click "New Policy"
   - Add the following policies:

#### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'analysis-assets');
```

#### Policy 2: Allow authenticated users to update
```sql
CREATE POLICY "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'analysis-assets');
```

#### Policy 3: Allow authenticated users to delete
```sql
CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'analysis-assets');
```

#### Policy 4: Allow public to view
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-assets');
```

### Option 2: SQL Editor (Quick Setup)

1. **Go to SQL Editor** in your Supabase dashboard
2. **Run this SQL script**:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('analysis-assets', 'analysis-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'analysis-assets');

CREATE POLICY IF NOT EXISTS "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'analysis-assets');

CREATE POLICY IF NOT EXISTS "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'analysis-assets');

CREATE POLICY IF NOT EXISTS "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-assets');
```

### Option 3: Using Supabase CLI

```bash
# Create bucket
supabase storage create analysis-assets --public

# Apply policies (create a file called storage-policies.sql with the content above)
supabase db push
```

## Verification

After setup, verify the bucket exists:

1. Go to Storage in Supabase dashboard
2. You should see `analysis-assets` bucket listed
3. It should show as "Public"

## Testing

Once the bucket is created:

1. Go to YieldPulse dashboard
2. Find a premium (paid) report
3. Hover over the "Image" column
4. Click the upload button
5. Select an image (max 5MB)
6. Image should upload successfully

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket name is exactly `analysis-assets` (lowercase, with hyphen)
- Verify the bucket is marked as "Public"

**Error: "Permission denied"**
- Check that all 4 storage policies are created
- Verify you're logged in as an authenticated user

**Error: "File too large"**
- Image must be less than 5MB
- Try compressing the image before uploading

## Additional Database Setup

The property image feature also requires a database column:

```sql
-- Add property_image_url column to analyses table
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS property_image_url TEXT;
```

Run this in the SQL Editor if the column doesn't exist yet.
