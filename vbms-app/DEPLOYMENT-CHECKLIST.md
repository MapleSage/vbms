# 🚀 Deployment Checklist - Van Photo Upload

## Pre-Deployment Verification

### ✅ Code Changes
- [x] @vercel/blob package installed
- [x] Database schema updated with photoUrl field
- [x] Upload API endpoint created
- [x] Frontend upload UI implemented
- [x] Photo display on van cards added
- [x] File validation implemented

### ✅ Local Testing
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:3000/vans/new
- [ ] Upload a test photo
- [ ] Verify preview appears
- [ ] Submit van form
- [ ] Check photo displays on /vans page
- [ ] Verify photo URL in database

### ✅ Environment Configuration
- [x] BLOB_READ_WRITE_TOKEN in .env.local
- [ ] Test upload works locally
- [ ] Verify Blob storage accessible

## Deployment Steps

### 1. Commit and Push
```bash
git add .
git commit -m "Add van photo upload with Vercel Blob storage"
git push origin main
```

### 2. Configure Vercel Environment Variables
Go to: https://vercel.com/maplesage-s-projects/vbs/settings/environment-variables

Add:
```
Name: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_OX5BOtSq8gItuGDz_wbA5SEqv6Q7y1nIpi61iC7rTHBUp4E
Environments: ✓ Production ✓ Preview ✓ Development
```

### 3. Deploy
- Vercel auto-deploys on push to main
- Or manually trigger: Vercel Dashboard → Deployments → Redeploy

### 4. Verify Production Database
The photoUrl field should already exist in your Azure SQL database since we ran `prisma db push` locally.

If needed, you can verify:
```bash
# Check if column exists in Azure SQL
# It should already be there from local push
```

## Post-Deployment Testing

### Test in Production
1. [ ] Navigate to your production URL
2. [ ] Go to /vans/new
3. [ ] Upload a test photo
4. [ ] Verify upload works
5. [ ] Check photo displays on /vans page
6. [ ] Test on mobile device
7. [ ] Test with different image formats (JPG, PNG, WebP)
8. [ ] Test file size validation (try >5MB file)

### Verify Blob Storage
1. [ ] Check Vercel Dashboard → Storage → Blob
2. [ ] Verify uploaded files appear
3. [ ] Check file URLs are accessible
4. [ ] Verify public access works

## Rollback Plan

If issues occur:

### Option 1: Revert Code
```bash
git revert HEAD
git push origin main
```

### Option 2: Remove Feature Flag
The photoUrl field is optional (nullable), so existing functionality continues to work even if uploads fail.

### Option 3: Disable Upload UI
Comment out the photo upload section in `app/vans/new/page.tsx` if needed.

## Success Criteria

✅ All tests pass
✅ Photos upload successfully
✅ Photos display on van cards
✅ No console errors
✅ Mobile responsive
✅ File validation works
✅ Existing vans still work (without photos)

## Monitoring

After deployment, monitor:
- Vercel deployment logs
- Browser console errors
- Blob storage usage
- Database queries (check for errors)

## Support Contacts

- Vercel Support: https://vercel.com/support
- Blob Storage Docs: https://vercel.com/docs/storage/vercel-blob

---

**Ready to Deploy**: ✅ All code changes complete
**Next Step**: Test locally, then deploy to production
