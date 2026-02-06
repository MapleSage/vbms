# Quick Azure SQL Setup for Vercel

## What You Need

1. **Azure SQL Database** (create in Azure Portal)
2. **Connection String** (from Azure)
3. **Vercel Environment Variable** (add DATABASE_URL)

## 3-Step Setup

### 1. Create Azure SQL Database

```
Azure Portal → Create Resource → SQL Database
- Name: vbms-db
- Server: vbms-server (create new)
- Pricing: Basic tier (~$5/month)
- Firewall: Allow Azure services ✅
```

### 2. Get Connection String

Azure Portal → Your Database → Connection Strings → Copy ADO.NET

Convert to Prisma format:
```
sqlserver://vbms-server.database.windows.net:1433;database=vbms-db;user=vbmsadmin;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=false;loginTimeout=30
```

### 3. Add to Vercel

```
Vercel Dashboard → Your Project → Settings → Environment Variables

Name: DATABASE_URL
Value: [your connection string from step 2]
Environments: ✅ Production ✅ Preview ✅ Development
```

## 4. Run Migrations

```bash
# In your terminal
export DATABASE_URL="your-azure-sql-connection-string"
npx prisma db push
npx prisma db seed
```

## 5. Redeploy

```bash
git push origin main
```

## Done! 🎉

Visit: https://vbs-ebon.vercel.app

Check status: https://vbs-ebon.vercel.app/setup

---

**Full guide**: See `AZURE-SQL-SETUP.md` for detailed instructions
