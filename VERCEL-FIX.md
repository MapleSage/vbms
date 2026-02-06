# Fix Vercel Deployment - Database Setup

## Issue

Your app is deployed but showing errors because the database isn't set up yet.

## Quick Fix (5 minutes)

### Step 1: Create PostgreSQL Database in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project (vbs-ebon)
3. Click "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Name it: `vbms-db`
7. Select region (closest to you)
8. Click "Create"

Vercel will automatically add `DATABASE_URL` to your environment variables.

### Step 2: Run Database Migrations

In your local terminal:

```bash
# Pull the production environment variables
vercel env pull .env.production

# Run migrations to create tables
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### Step 3: Redeploy

Push your latest changes:

```bash
git push origin main
```

Or manually redeploy in Vercel dashboard:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### Step 4: Verify

Visit your app: https://vbs-ebon.vercel.app

You should now see:
- ✅ Homepage loads
- ✅ Bookings page shows data
- ✅ Vans page shows data
- ✅ Calendar works
- ✅ Can create new bookings

## Alternative: Check Setup Page

Visit https://vbs-ebon.vercel.app/setup to see database status and get step-by-step instructions.

## Troubleshooting

### Error: "Can't reach database server"

**Solution**: Make sure you've created the Postgres database in Vercel Storage tab.

### Error: "Table does not exist"

**Solution**: Run `npx prisma db push` to create the tables.

### Error: "No data showing"

**Solution**: Run `npx prisma db seed` to add sample data.

### Still having issues?

1. Check Vercel logs: https://vercel.com/your-project/logs
2. Verify DATABASE_URL is set in environment variables
3. Make sure you're using the production environment variables

## What Changed

I've added:
- `/api/health` - Endpoint to check database connection
- `/setup` - Setup page with instructions
- Error handling in calendar page
- Database status banner on homepage

These changes help identify and fix database issues quickly.

## Need More Help?

Check the full deployment guide: `vbms-app/DEPLOY-VERCEL.md`
