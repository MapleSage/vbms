# Quick Test Guide - Van Photo Upload

## Test in 3 Steps

### Step 1: Start Dev Server
```bash
cd vbms-app
npm run dev
```

### Step 2: Navigate to Add Van Page
Open browser: http://localhost:3000/vans/new

### Step 3: Upload a Photo
1. Click "Upload Photo" button
2. Select any image file (JPG, PNG, WebP)
3. See preview appear
4. Fill in van details:
   - Van ID: TEST001
   - Registration: TEST123
   - Make: Ford
   - Model: Transit
   - Daily Rate: 100
   - Mileage Rate: 0.50
5. Click "Add Van"

### Step 4: View Result
Navigate to: http://localhost:3000/vans
- Your new van should appear with the photo displayed

## What You'll See

### Upload Form
```
┌─────────────────────────────────────┐
│ Van Photo                           │
│ ┌─────────────┐                     │
│ │ Upload Photo│  JPG, PNG or WebP   │
│ └─────────────┘                     │
└─────────────────────────────────────┘
```

### After Upload
```
┌─────────────────────────────────────┐
│ Van Photo                           │
│ ┌──────────────┐                    │
│ │   [Image]    │ [X]                │
│ │   Preview    │                    │
│ └──────────────┘                    │
└─────────────────────────────────────┘
```

### Van Card with Photo
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │      [Van Photo Displayed]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🚗 TEST123                          │
│ TEST001                             │
│                                     │
│ Make & Model: Ford Transit          │
│ Year: 2024                          │
│ Daily Rate: $100                    │
└─────────────────────────────────────┘
```

## Troubleshooting

### Upload Button Not Working?
- Check browser console for errors
- Verify BLOB_READ_WRITE_TOKEN in .env.local

### Photo Not Displaying?
- Check if photoUrl is saved in database
- Verify Vercel Blob storage is accessible
- Check browser network tab for image load errors

### File Too Large Error?
- Max file size is 5MB
- Try a smaller image

## Success Indicators

✅ Upload button changes to "Uploading..." during upload
✅ Preview appears after successful upload
✅ Remove button (X) appears on preview
✅ Photo URL is saved with van record
✅ Photo displays on van card in fleet list

## Ready to Deploy?

Once testing is successful locally:
1. Commit changes to git
2. Push to GitHub
3. Vercel auto-deploys
4. Add BLOB_READ_WRITE_TOKEN to Vercel environment variables
5. Test in production!
