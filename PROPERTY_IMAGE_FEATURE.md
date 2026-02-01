# Property Image Feature

## ⚠️ IMPORTANT: Backend Setup Required

**This feature requires backend configuration before it will work:**

1. **Storage Bucket**: Create the `analysis-assets` bucket in Supabase (see Backend Requirements section)
2. **Database Migration**: Add `property_image_url` column to the `analyses` table
3. **API Endpoint**: Implement the `PATCH /analyses/:id/property-image` endpoint

**Until the backend is configured**, users will see a message: "Image upload is not yet configured. Please contact support."

---

## Overview
This feature adds the ability to upload reference images to premium reports. Images are displayed in the dashboard, premium reports, and comparison reports.

## Key Rules
- **Premium Reports Only**: Image upload is ONLY available for premium (paid) reports
- **Free Reports**: Display a placeholder image icon (no upload capability)
- **Dashboard**: Images appear in the 2nd column after "Property Name"

## Implementation Details

### 1. Database Schema
The `analyses` table includes a new field:
- `property_image_url` (text, nullable): Stores the public URL of the uploaded image

### 2. Storage Bucket
A Supabase storage bucket named `analysis-assets` is required with the following configuration:
- **Public bucket**: Yes (images need to be publicly accessible)
- **File size limit**: 5MB per file
- **Allowed file types**: image/* (JPG, PNG, GIF, WebP, etc.)
- **Folder structure**: `property-images/{analysisId}-{timestamp}.{ext}`

### 3. API Endpoint
New endpoint required in the backend:
```
PATCH /make-server-ef294769/analyses/:id/property-image
Body: { "propertyImageUrl": "https://..." }
```

### 4. User Interface

#### Dashboard
- Image column appears after "Property Name" column
- For premium reports:
  - Shows uploaded image or placeholder icon
  - On hover: Upload/change/remove buttons appear
  - Shows loading spinner during upload
- For free reports:
  - Shows placeholder icon only (no hover interaction)

#### Premium Report
- New section "Property Image" appears after "Report Details"
- Displays full image (max 400px height, responsive width)
- Image is contained within a bordered panel

#### Comparison Report
- New row "Property Image" appears at the top of the metrics table
- Shows thumbnails (96x96px) for each property
- Only displays if at least one property has an image

### 5. File Handling
- **Validation**: File type must be image/*, max 5MB
- **Naming**: `{analysisId}-{timestamp}.{extension}`
- **Upload**: Direct to Supabase storage
- **Deletion**: Removes file from storage when user deletes image

### 6. PDF Export
- Property images are included in comparison PDF exports
- Images appear in the property details section of the PDF

## Files Modified
- `/src/pages/DashboardPage.tsx` - Added image upload UI and handlers
- `/src/components/PremiumReport.tsx` - Added image display section
- `/src/pages/ComparisonPage.tsx` - Added image row in comparison table
- `/src/utils/apiClient.ts` - Added updatePropertyImage function
- `/src/utils/calculations.ts` - Added propertyImageUrl to PropertyInputs
- `/src/utils/comparisonPdfGenerator.ts` - Added property_image_url to interface

## Backend Requirements

### 1. Database Migration
```sql
ALTER TABLE analyses 
ADD COLUMN property_image_url TEXT;
```

### 2. Storage Bucket Setup
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('analysis-assets', 'analysis-assets', true);

-- Set up storage policies
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'analysis-assets');

CREATE POLICY "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'analysis-assets');

CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'analysis-assets');

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-assets');
```

### 3. API Endpoint Implementation
```typescript
// PATCH /make-server-ef294769/analyses/:id/property-image
// Update the property_image_url field for an analysis
// Only the owner can update their analysis
// Validates that analysis belongs to authenticated user
```

## Testing Checklist
- [ ] Upload image to premium report from dashboard
- [ ] Hover shows upload button only for premium reports
- [ ] Free reports show placeholder with no hover interaction
- [ ] Image appears in premium report PDF
- [ ] Image appears in comparison table
- [ ] Image appears in comparison PDF
- [ ] Delete image removes it from storage and database
- [ ] File size limit (5MB) is enforced
- [ ] File type validation works (only images allowed)
- [ ] Loading state shows during upload
- [ ] Error handling for upload failures
- [ ] Multiple property images work in comparison