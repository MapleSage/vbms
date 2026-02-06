# Fix Vercel Deployment - Azure SQL Database Setup

## Issue

Your app is deployed to Vercel but showing errors because the Azure SQL Database isn't connected yet.

## Architecture

- **Hosting**: Vercel (Next.js app)
- **Database**: Azure SQL Database
- **Connection**: Via DATABASE_URL environment variable

## Quick Fix (10 minutes)

### Step 1: Create Azure SQL Database

1. Go to https://portal.azure.com
2. Create a new SQL Database:
   - **Database name**: `vbms-db`
   - **Server**: Create new (e.g., `vbms-server`)
   - **Pricing tier**: Basic (cheapest) or Standard S0
3. Configure firewall:
   - Enable "Allow Azure services and resources to access this server"
4. Copy the connection string from "Connection strings" section

### Step 2: Format Connection String for Prisma

Convert Azure's connection string to Prisma format:

```
sqlserver://YOUR-SERVER.database.windows.net:1433;database=vbms-db;user=YOUR-USERNAME;password=YOUR-PASSWORD;encrypt=true;trustServerCertificate=false;loginTimeout=30
```

Replace:
- `YOUR-SERVER` with your server name
- `YOUR-USERNAME` with your admin username
- `YOUR-PASSWORD` with your password

### Step 3: Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project (vbs-ebon)
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your formatted connection string
   - **Environments**: Production, Preview, Development
5. Click "Save"

### Step 4: Run Database Migrations

In your local terminal:

```bash
# Set your Azure SQL connection string
export DATABASE_URL="your-azure-sql-connection-string"

# Run migrations to create tables
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### Step 5: Redeploy Vercel

Push your latest changes:

```bash
git push origin main
```

Or manually redeploy in Vercel dashboard:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### Step 6: Verify

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
