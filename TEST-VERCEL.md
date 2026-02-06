# Test Vercel Deployment

## What I Just Fixed

1. **Force Dynamic Rendering** - Added `export const dynamic = 'force-dynamic'` to prevent static generation
2. **Better Logging** - Added console logs to see what's happening
3. **Debug Endpoint** - Created `/api/debug` to test database connection
4. **Image Config** - Added Vercel Blob domains for photo uploads

## Test After Deployment

### 1. Test Debug Endpoint
Visit: `https://vbs-denswwtlg-maplesage-s-projects.vercel.app/api/debug`

This will show:
- Database connection status
- Number of vans and bookings
- Environment variables status
- Any errors

### 2. Test API Routes Directly
Visit: `https://vbs-denswwtlg-maplesage-s-projects.vercel.app/api/vans`

Should return JSON with van data.

### 3. Check Vercel Logs
Go to: https://vercel.com/maplesage-s-projects/vbs/deployments
- Click latest deployment
- Click "Functions" tab
- Look for logs from the API routes

## What to Look For

### If /api/debug shows:
```json
{
  "success": true,
  "database": {
    "connected": true,
    "vans": 23,
    "bookings": 3
  }
}
```
✅ Database is connected and has data

### If /api/debug shows error:
```json
{
  "success": false,
  "error": "..."
}
```
❌ Database connection issue - check DATABASE_URL in Vercel

### If /api/vans returns empty array:
```json
[]
```
❌ Database is empty or query is failing

## Common Issues

### Issue 1: DATABASE_URL not set correctly
- Go to Vercel → Settings → Environment Variables
- Verify DATABASE_URL matches your .env.local
- Make sure it's set for Production environment

### Issue 2: Prisma Client not generated
- Vercel should run `prisma generate` during build
- Check build logs for "Generated Prisma Client"

### Issue 3: Static Generation
- Fixed with `export const dynamic = 'force-dynamic'`
- Pages will now fetch data on every request

## Next Steps

1. Wait for deployment (~2 minutes)
2. Visit `/api/debug` endpoint
3. Share the response with me
4. We'll fix based on what we see

---

**Deployment Status**: Check https://vercel.com/maplesage-s-projects/vbs/deployments
