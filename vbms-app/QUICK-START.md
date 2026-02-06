# 🚀 VBMS Quick Start - Deploy in 15 Minutes

## Current Status

I've created the foundation files for your VBMS application. To get a working application deployed quickly, follow this guide.

## Fastest Path to Deployment

### Step 1: Initialize Next.js Project (2 minutes)

```bash
# Navigate to your workspace
cd /path/to/your/workspace

# Create new Next.js app
npx create-next-app@latest vbms-production \
  --typescript \
  --tailwind \
  --app \
  --use-npm \
  --no-src-dir

cd vbms-production
```

### Step 2: Copy Our Files (1 minute)

```bash
# Copy the files I created
cp ../vbms-app/prisma/schema.prisma ./prisma/
cp ../vbms-app/package.json ./package.json
cp ../vbms-app/.env.example ./.env
cp ../vbms-app/lib/prisma.ts ./lib/
cp ../vbms-app/app/globals.css ./app/
```

### Step 3: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 4: Setup Azure SQL Database (5 minutes)

**Option A: Use Azure Portal**
1. Go to portal.azure.com
2. Create SQL Database
3. Copy connection string

**Option B: Use Azure CLI**
```bash
# Login
az login

# Create resource group
az group create --name vbms-rg --location eastus

# Create SQL server
az sql server create \
  --name vbms-sql-$(date +%s) \
  --resource-group vbms-rg \
  --location eastus \
  --admin-user vbmsadmin \
  --admin-password "SecurePass123!"

# Create database
az sql db create \
  --resource-group vbms-rg \
  --server vbms-sql-XXXXX \
  --name vbms-db \
  --service-objective S0

# Allow Azure services
az sql server firewall-rule create \
  --resource-group vbms-rg \
  --server vbms-sql-XXXXX \
  --name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 5: Configure Environment (1 minute)

Edit `.env`:
```env
DATABASE_URL="sqlserver://vbms-sql-XXXXX.database.windows.net:1433;database=vbms-db;user=vbmsadmin;password=SecurePass123!;encrypt=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### Step 6: Initialize Database (2 minutes)

```bash
npx prisma generate
npx prisma db push
```

### Step 7: Run Locally (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Deploy to Vercel (2 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: vbms-app
# - Directory: ./
# - Override settings? No

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## What's Missing (Add These Next)

The base Next.js app needs these VBMS-specific features:

### 1. API Routes (I'll provide code)
- `/app/api/vans/route.ts` - Van CRUD
- `/app/api/bookings/route.ts` - Booking management
- `/app/api/bookings/check-conflict/route.ts` - Conflict detection

### 2. Pages (I'll provide code)
- `/app/page.tsx` - Dashboard
- `/app/bookings/page.tsx` - Bookings list
- `/app/bookings/new/page.tsx` - Create booking
- `/app/vans/page.tsx` - Van management

### 3. Components (I'll provide code)
- Booking form
- Van list
- Calendar view
- Navigation

## Next Session Plan

In our next session, I'll provide you with:

1. **Complete API routes** - Copy-paste ready
2. **UI components** - Pre-built React components
3. **Pages** - Complete page implementations
4. **Authentication** - Azure AD integration

For now, you have:
- ✅ Database schema
- ✅ Project structure
- ✅ Configuration files
- ✅ Deployment setup

## Alternative: Use Template

If you want everything pre-built, I can:

1. Create a GitHub repository with complete code
2. You clone and deploy
3. Customize as needed

**Would you like me to:**
A) Provide the missing code files now (API routes + pages)?
B) Create a complete GitHub repo?
C) Continue in next session?

Let me know and I'll proceed!

## Troubleshooting

### Database Connection Failed
- Check firewall rules
- Verify connection string
- Test with Azure Data Studio

### Vercel Deployment Failed
- Ensure environment variables are set
- Check build logs
- Verify DATABASE_URL is correct

### Local Development Issues
- Run `npm install` again
- Delete `.next` folder
- Clear node_modules and reinstall

## Support

Need help? I'm here to assist with:
- Code implementation
- Deployment issues
- Azure configuration
- Feature additions

---

**Status**: Foundation Ready ✅
**Next**: Add application code
**Time to Deploy**: 15 minutes
