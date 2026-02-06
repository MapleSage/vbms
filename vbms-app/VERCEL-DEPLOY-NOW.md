# 🚀 Deploy to Vercel - Step by Step

## Current Status
- ✅ Code works locally with Azure SQL
- ✅ Photo upload works locally
- ✅ Vercel Blob token configured locally
- ⏳ Need to deploy to Vercel production

## Deployment Steps

### Step 1: Add Environment Variables to Vercel

Go to: https://vercel.com/maplesage-s-projects/vbs/settings/environment-variables

Add these variables (if not already there):

#### 1. BLOB_READ_WRITE_TOKEN
```
Name: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_OX5BOtSq8gItuGDz_wbA5SEqv6Q7y1nIpi61iC7rTHBUp4E
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 2. DATABASE_URL (should already exist)
```
Name: DATABASE_URL
Value: sqlserver://vbms-server-1770374352.database.windows.net:1433;database=vbms-db;user=vbmsadmin;password=VbmsSecure2026!;encrypt=true;trustServerCertificate=false;loginTimeout=30
Environments: ✓ Production ✓ Preview ✓ Development
```

### Step 2: Commit and Push Changes

```bash
# Make sure you're in the root directory
cd /path/to/VBSM

# Check git status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add van photo upload with Vercel Blob storage"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

### Step 3: Monitor Deployment

1. Go to: https://vercel.com/maplesage-s-projects/vbs
2. Click on "Deployments" tab
3. Watch the latest deployment
4. Wait for "Ready" status

### Step 4: Verify Production

Once deployed, test:
1. Visit your production URL: https://vbs-[your-domain].vercel.app
2. Navigate to /vans/new
3. Try uploading a van photo
4. Verify it works in production

## Troubleshooting

### If deployment fails:

#### Check Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the failed deployment
3. Check the build logs for errors

#### Common Issues:

**Issue 1: Missing Environment Variables**
- Solution: Add BLOB_READ_WRITE_TOKEN to Vercel environment variables
- Go to Settings → Environment Variables

**Issue 2: Database Connection**
- Solution: Verify DATABASE_URL is correct in Vercel
- Make sure Azure SQL firewall allows Vercel IPs

**Issue 3: Build Errors**
- Solution: Check if `npm run build` works locally
- Run: `cd vbms-app && npm run build`

### If photo upload doesn't work in production:

**Check 1: Blob Token**
```bash
# Verify token is set in Vercel
# Go to: Settings → Environment Variables
# Confirm BLOB_READ_WRITE_TOKEN exists
```

**Check 2: API Route**
```bash
# Test the upload endpoint
curl -X POST https://your-app.vercel.app/api/vans/upload?filename=test.jpg
```

**Check 3: Browser Console**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

## Quick Deploy Commands

```bash
# From project root
cd vbms-app

# Test build locally first
npm run build

# If build succeeds, commit and push
cd ..
git add .
git commit -m "Add photo upload feature"
git push origin main
```

## Vercel CLI Alternative

If you prefer using Vercel CLI:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy from vbms-app directory
cd vbms-app
vercel --prod

# Follow prompts
```

## Expected Result

After successful deployment:
- ✅ App builds without errors
- ✅ Deployment shows "Ready" status
- ✅ Production URL is accessible
- ✅ Photo upload works on production
- ✅ Photos display on van cards

## Rollback Plan

If something goes wrong:

### Option 1: Revert via Vercel Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Option 2: Revert via Git
```bash
git revert HEAD
git push origin main
```

---

**Ready to Deploy?** Follow Step 1 → Step 2 → Step 3 → Step 4
