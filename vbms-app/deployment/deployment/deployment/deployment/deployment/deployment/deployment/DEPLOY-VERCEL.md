# Deploy to Vercel - Step by Step Guide

This guide will help you deploy the Van Booking & Fleet Management System to Vercel.

## Prerequisites

- Vercel account (free tier works fine)
- GitHub account (optional, but recommended)
- The application code ready to deploy

## Deployment Options

### Option 1: Deploy via Vercel CLI (Fastest)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd vbms-app
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: vbms-app (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

#### Step 4: Set up Database

After deployment, you need to set up a PostgreSQL database:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a name (e.g., vbms-db)
7. Select region (closest to your users)
8. Click "Create"

#### Step 5: Connect Database

Vercel will automatically add the `DATABASE_URL` environment variable. Now run migrations:

```bash
# In your local terminal
vercel env pull .env.production

# Update your local .env with the production DATABASE_URL
# Then run migrations
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

#### Step 6: Redeploy

```bash
vercel --prod
```

Your app is now live! 🎉

---

## Option 2: Deploy via GitHub (Recommended for Teams)

### Step 1: Push to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VBMS application"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/vbms.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `vbms-app`
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Configure Environment Variables

Before deploying, add environment variables:

1. In the import screen, expand "Environment Variables"
2. Add the following (we'll update DATABASE_URL later):
   ```
   NODE_ENV=production
   ```

3. Click "Deploy"

### Step 4: Set up PostgreSQL Database

1. After deployment, go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Name it (e.g., vbms-production)
6. Select region
7. Click "Create"

Vercel will automatically:
- Create the database
- Add `DATABASE_URL` to your environment variables
- Link it to your project

### Step 5: Run Database Migrations

You have two options:

**Option A: Via Vercel CLI**
```bash
# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

**Option B: Via Prisma Data Platform**
1. Go to https://cloud.prisma.io
2. Connect your database
3. Run migrations from the dashboard

### Step 6: Redeploy

Vercel will automatically redeploy when you push to GitHub, or you can manually redeploy:

1. Go to your project dashboard
2. Click "Deployments"
3. Click "..." on the latest deployment
4. Click "Redeploy"

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database is connected (check `/api/vans` endpoint)
- [ ] All pages are accessible
- [ ] Bookings can be created
- [ ] Calendar view works
- [ ] No console errors

## Testing Your Deployment

Visit your deployment URL and test:

```bash
# Check if API works
curl https://your-app.vercel.app/api/vans

# Should return JSON array of vans
```

## Environment Variables Reference

Required environment variables for production:

```env
# Automatically set by Vercel Postgres
DATABASE_URL="postgresql://..."

# Optional - for authentication
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret"

# Optional - for Azure AD
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

## Updating Your Deployment

### Via GitHub (Automatic)

Simply push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically deploy the changes.

### Via Vercel CLI (Manual)

```bash
cd vbms-app
vercel --prod
```

## Troubleshooting

### Build Fails

**Error**: "Cannot find module '@prisma/client'"

**Solution**: Make sure `postinstall` script is in package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Issues

**Error**: "Can't reach database server"

**Solution**: 
1. Check DATABASE_URL is set in Vercel environment variables
2. Make sure you've run `prisma db push`
3. Verify database is in the same region as your deployment

### API Routes Return 500

**Error**: API routes fail with 500 errors

**Solution**:
1. Check Vercel logs: `vercel logs`
2. Ensure Prisma Client is generated: `prisma generate`
3. Verify database schema is up to date: `prisma db push`

### Pages Show 404

**Error**: Some pages return 404

**Solution**:
1. Make sure all files are committed to git
2. Check build logs for errors
3. Verify file names match routes exactly (case-sensitive)

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times, you can enable Edge Runtime for API routes:

```typescript
// In your API route file
export const runtime = 'edge'
```

### Add Caching

Add caching headers to API responses:

```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  })
}
```

## Monitoring

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Analytics

Vercel provides built-in analytics:
1. Go to your project dashboard
2. Click "Analytics" tab
3. View page views, performance metrics, etc.

## Custom Domain (Optional)

To add a custom domain:

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation (can take up to 48 hours)

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs

## Success! 🎉

Your Van Booking & Fleet Management System is now live on Vercel!

Share your deployment URL with your team and start managing your fleet!
