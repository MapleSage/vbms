# Check Vercel Environment Variables

## Your Vercel Project
- **Team**: maplesage-s-projects
- **Project**: vbs (the correct one you reconnected)
- **URL**: https://vercel.com/maplesage-s-projects/vbs

## Required Environment Variables

Go to: https://vercel.com/maplesage-s-projects/vbs/settings/environment-variables

### Check These Variables Exist:

#### 1. DATABASE_URL ✓
Should already be there from previous setup

#### 2. BLOB_READ_WRITE_TOKEN ⚠️
**This is the one you need to add!**

```
Name: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_OX5BOtSq8gItuGDz_wbA5SEqv6Q7y1nIpi61iC7rTHBUp4E
```

**Important**: 
- Check all three environments: Production, Preview, Development
- Click "Save" after adding

## After Adding the Variable

### Option 1: Trigger Redeploy (Recommended)
1. Go to: https://vercel.com/maplesage-s-projects/vbs/deployments
2. Click on the latest deployment
3. Click "..." menu → "Redeploy"
4. Select "Use existing Build Cache" → Click "Redeploy"

### Option 2: Push a Small Change
```bash
# Add the new doc file
git add CHECK-VERCEL-ENV.md vbms-app/VERCEL-DEPLOY-NOW.md
git commit -m "Add deployment documentation"
git push origin main
```

## Verify It Works

After redeployment:
1. Visit: https://vbs-[your-domain].vercel.app/vans/new
2. Try uploading a photo
3. Check if it works!

## Current Deployment Status

Check: https://vercel.com/maplesage-s-projects/vbs

- Latest commit: "photo update" (df99a90)
- This commit includes the photo upload code
- Just needs BLOB_READ_WRITE_TOKEN environment variable

---

**Next Step**: Add BLOB_READ_WRITE_TOKEN to Vercel, then redeploy
