# How to Fix "Bucket not found" Error

## Problem
When trying to upload property images, you see this error:
```
Error uploading image: StorageApiError: Bucket not found
```

## Solution (Takes 1 minute)

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your YieldPulse project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Setup Script
1. Open the `supabase-storage-setup.sql` file in this project
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify
At the bottom of the SQL script, you should see a verification query that returns:
- **id**: `analysis-assets`
- **public**: `true`
- **file_size_limit**: `5242880`

If you see this row, the setup is complete! ✅

### Step 4: Test
1. Refresh your YieldPulse dashboard
2. Find a premium (paid) report
3. Hover over the "Image" column
4. Click the upload button
5. Upload an image (max 5MB)

The upload should now work perfectly!

## What This Creates

The SQL script creates:
1. **Storage Bucket**: `analysis-assets` (public bucket for property images)
2. **Security Policies**: Allows authenticated users to upload/delete, and public users to view
3. **File Limits**: Max 5MB per image, only allows image file types

## Troubleshooting

**Error: "relation already exists"**
- The bucket already exists. Check Storage → Buckets in Supabase dashboard
- Make sure it's marked as "Public"

**Still getting "Bucket not found"**
- Double-check the bucket name is exactly `analysis-assets` (lowercase, with hyphen)
- Make sure you ran the SQL in the correct Supabase project
- Try refreshing the dashboard page

**Need Help?**
- See `SUPABASE_SETUP.md` for detailed instructions
- See `PROPERTY_IMAGE_FEATURE.md` for feature documentation

## Quick Visual Guide

```
Supabase Dashboard
├─ SQL Editor (click here)
│  └─ Paste script
│  └─ Click "Run"
└─ Storage (verify here)
   └─ Should see "analysis-assets" bucket
```
