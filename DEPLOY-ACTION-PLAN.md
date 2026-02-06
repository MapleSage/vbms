# 🎯 Action Plan - Deploy Photo Upload to Vercel

## Current Situation
- ✅ Code is committed and pushed (commit: df99a90 "photo update")
- ✅ Works perfectly locally with Azure SQL
- ✅ Vercel project "vbs" is connected to your repo
- ⚠️ Missing: BLOB_READ_WRITE_TOKEN in Vercel environment variables

## What You Need to Do (3 Simple Steps)

### Step 1: Add Environment Variable to Vercel (2 minutes)

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/maplesage-s-projects/vbs/settings/environment-variables

2. **Click "Add New" button**

3. **Fill in the form:**
   ```
   Name: BLOB_READ_WRITE_TOKEN
   
   Value: vercel_blob_rw_OX5BOtSq8gItuGDz_wbA5SEqv6Q7y1nIpi61iC7rTHBUp4E
   
   Environments: 
   ✓ Production
   ✓ Preview  
   ✓ Development
   ```

4. **Click "Save"**

### Step 2: Redeploy (1 minute)

1. **Go to Deployments**
   - https://vercel.com/maplesage-s-projects/vbs/deployments

2. **Find the latest deployment** (should be "photo update")

3. **Click the "..." menu** → Select "Redeploy"

4. **Click "Redeploy"** button

5. **Wait for deployment** (usually 1-2 minutes)
   - Status will change from "Building" → "Ready"

### Step 3: Test Production (1 minute)

1. **Visit your production URL**
   - Find it in Vercel dashboard under "Domains"
   - Should be something like: `vbs.vercel.app` or your custom domain

2. **Navigate to** `/vans/new`

3. **Try uploading a van photo**
   - Click "Upload Photo"
   - Select an image
   - Fill in van details
   - Submit

4. **Verify photo displays** on `/vans` page

## That's It! 🎉

If all three steps work, your photo upload feature is live in production!

## Troubleshooting

### If Step 1 doesn't work:
- Make sure you're logged into the correct Vercel account
- Verify you have access to the "vbs" project
- Try refreshing the page

### If Step 2 doesn't work:
- Check deployment logs for errors
- Look for any red error messages
- Share the error message if you need help

### If Step 3 doesn't work:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls
- Verify the BLOB_READ_WRITE_TOKEN was saved correctly

## Quick Links

- **Vercel Project**: https://vercel.com/maplesage-s-projects/vbs
- **Environment Variables**: https://vercel.com/maplesage-s-projects/vbs/settings/environment-variables
- **Deployments**: https://vercel.com/maplesage-s-projects/vbs/deployments

---

**Time Required**: ~5 minutes total
**Difficulty**: Easy - just add one environment variable and redeploy
