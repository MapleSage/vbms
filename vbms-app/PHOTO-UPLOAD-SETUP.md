# Van Photo Upload Setup

Van photo upload functionality has been added using Vercel Blob storage.

## Setup Steps

### 1. Get Vercel Blob Token

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → Select **Blob**
4. Copy the `BLOB_READ_WRITE_TOKEN` from the connection details

### 2. Add Environment Variable

Add to your `.env` file:
```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
```

### 3. Add to Vercel Environment Variables

In your Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add `BLOB_READ_WRITE_TOKEN` with your token value
3. Make sure it's available for all environments (Production, Preview, Development)

### 4. Update Database Schema

Run the migration to add the `photoUrl` field:
```bash
cd vbms-app
npx prisma db push
```

## Features Added

- **Upload van photos** when creating new vans
- **Preview photos** before submitting
- **Display photos** on the vans list page
- **File validation**: Only images (JPG, PNG, WebP), max 5MB
- **Remove photos** before submission

## Files Modified

- `prisma/schema.prisma` - Added `photoUrl` field to Van model
- `app/vans/new/page.tsx` - Added photo upload UI
- `app/vans/page.tsx` - Display photos in van cards
- `app/api/vans/route.ts` - Handle photoUrl in API
- `app/api/vans/upload/route.ts` - New upload endpoint

## Usage

1. Navigate to **Add Van** page
2. Click **Upload Photo** button
3. Select an image file
4. Preview appears with option to remove
5. Fill in van details
6. Submit form - photo URL is saved with van record

## Notes

- Photos are stored in Vercel Blob storage (not in database)
- Database only stores the URL reference
- Photos are publicly accessible via the URL
- No authentication required for viewing photos
