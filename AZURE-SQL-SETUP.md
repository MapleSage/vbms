# Connect Vercel to Azure SQL Database

This guide shows you how to connect your Vercel-hosted Next.js app to an Azure SQL Database.

## Architecture

- **Frontend/Backend**: Vercel (Next.js)
- **Database**: Azure SQL Database
- **Connection**: Secure connection string via environment variables

## Prerequisites

- Azure account with active subscription
- Vercel project deployed (https://vbs-ebon.vercel.app)
- Azure CLI installed (optional)

## Step 1: Create Azure SQL Database

### Option A: Via Azure Portal

1. Go to https://portal.azure.com
2. Click "Create a resource"
3. Search for "SQL Database"
4. Click "Create"

**Configure Database:**
- **Subscription**: Select your subscription
- **Resource Group**: Create new or use existing (e.g., `vbms-rg`)
- **Database Name**: `vbms-db`
- **Server**: Create new server
  - **Server name**: `vbms-server` (must be globally unique)
  - **Location**: Choose closest region
  - **Authentication**: SQL authentication
  - **Admin login**: `vbmsadmin`
  - **Password**: Create strong password (save this!)
- **Compute + Storage**: 
  - Click "Configure database"
  - Select "Basic" tier (cheapest, good for dev/test)
  - Or "Standard S0" for production
- **Backup storage redundancy**: Locally-redundant

5. Click "Review + Create"
6. Click "Create"

Wait 5-10 minutes for deployment to complete.

### Option B: Via Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name vbms-rg --location eastus

# Create SQL Server
az sql server create \
  --name vbms-server \
  --resource-group vbms-rg \
  --location eastus \
  --admin-user vbmsadmin \
  --admin-password 'YourStrongPassword123!'

# Create SQL Database
az sql db create \
  --resource-group vbms-rg \
  --server vbms-server \
  --name vbms-db \
  --service-objective Basic
```

## Step 2: Configure Firewall Rules

You need to allow Vercel to connect to your Azure SQL Database.

### Allow Azure Services

1. Go to your SQL Server in Azure Portal
2. Click "Networking" (or "Firewalls and virtual networks")
3. Under "Exceptions":
   - ✅ Check "Allow Azure services and resources to access this server"
4. Click "Save"

### Add Vercel IP Ranges (Recommended for Production)

Vercel uses dynamic IPs, but you can allow all outbound IPs:

1. In "Networking", click "Add client IP"
2. Or add IP range: `0.0.0.0` to `255.255.255.255` (allows all - less secure)

**For better security**, use Azure Private Link or VNet integration (requires higher tier).

## Step 3: Get Connection String

### Via Azure Portal

1. Go to your SQL Database (`vbms-db`)
2. Click "Connection strings" in left menu
3. Copy the "ADO.NET" connection string
4. It looks like:
```
Server=tcp:vbms-server.database.windows.net,1433;Initial Catalog=vbms-db;Persist Security Info=False;User ID=vbmsadmin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### Format for Prisma

Convert to Prisma format:
```
sqlserver://vbms-server.database.windows.net:1433;database=vbms-db;user=vbmsadmin;password=YourStrongPassword123!;encrypt=true;trustServerCertificate=false;loginTimeout=30
```

**Important**: Replace `{your_password}` with your actual password!

## Step 4: Add to Vercel Environment Variables

### Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your connection string (from Step 3)
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"

### Via Vercel CLI

```bash
vercel env add DATABASE_URL production
# Paste your connection string when prompted
```

## Step 5: Run Database Migrations

Now that the connection is configured, create the database tables:

```bash
# Pull environment variables from Vercel
vercel env pull .env.production

# Update your local .env to use the production DATABASE_URL
# Or temporarily set it:
export DATABASE_URL="your-azure-sql-connection-string"

# Run migrations
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

## Step 6: Redeploy Vercel

Trigger a new deployment to pick up the environment variable:

```bash
# Option 1: Push to GitHub (auto-deploys)
git push origin main

# Option 2: Manual redeploy via CLI
vercel --prod

# Option 3: Via Vercel Dashboard
# Go to Deployments → Click "..." → Redeploy
```

## Step 7: Verify Connection

Visit your app: https://vbs-ebon.vercel.app

Check:
- ✅ Homepage loads
- ✅ Visit `/setup` to see database status
- ✅ Bookings page shows data
- ✅ Can create new bookings

## Troubleshooting

### Error: "Cannot open server"

**Cause**: Firewall blocking connection

**Solution**:
1. Go to Azure Portal → SQL Server → Networking
2. Enable "Allow Azure services and resources to access this server"
3. Add your IP or allow all IPs (0.0.0.0 - 255.255.255.255)

### Error: "Login failed for user"

**Cause**: Wrong credentials

**Solution**:
1. Verify username and password in connection string
2. Check if user has access to the database
3. Try resetting the admin password in Azure Portal

### Error: "SSL connection required"

**Cause**: Azure SQL requires encrypted connections

**Solution**: Ensure your connection string has:
```
encrypt=true;trustServerCertificate=false
```

### Error: "Timeout expired"

**Cause**: Network connectivity issues

**Solution**:
1. Check firewall rules
2. Verify server name is correct
3. Try increasing `loginTimeout` in connection string

### Connection String Format Issues

Make sure your connection string follows this format:
```
sqlserver://SERVER.database.windows.net:1433;database=DBNAME;user=USERNAME;password=PASSWORD;encrypt=true;trustServerCertificate=false;loginTimeout=30
```

## Cost Optimization

### Development/Testing
- Use **Basic** tier: ~$5/month
- Or **Serverless** tier: Pay per use

### Production
- **Standard S0**: ~$15/month
- **Standard S1**: ~$30/month
- Scale up/down as needed

### Free Option
- Azure SQL Database doesn't have a free tier
- Consider Azure SQL Database serverless for dev/test (auto-pauses when not in use)

## Security Best Practices

1. **Use Strong Passwords**: 12+ characters, mixed case, numbers, symbols
2. **Limit IP Access**: Only allow Vercel IPs if possible
3. **Enable Azure AD Authentication**: For better security (advanced)
4. **Use Key Vault**: Store connection strings in Azure Key Vault
5. **Enable Auditing**: Track database access
6. **Regular Backups**: Azure SQL has automatic backups, but verify retention

## Monitoring

### Via Azure Portal

1. Go to your SQL Database
2. Check "Metrics" for:
   - DTU usage
   - Storage usage
   - Connection count
3. Set up alerts for high usage

### Via Vercel

1. Check Vercel logs for database errors
2. Monitor API response times

## Next Steps

Once connected:
1. ✅ Test all pages work
2. ✅ Create some test bookings
3. ✅ Set up automated backups
4. ✅ Configure monitoring alerts
5. ✅ Document connection details for your team

## Need Help?

- Azure SQL Documentation: https://docs.microsoft.com/azure/sql-database/
- Prisma SQL Server Guide: https://www.prisma.io/docs/concepts/database-connectors/sql-server
- Vercel Environment Variables: https://vercel.com/docs/environment-variables

---

**Your setup**: Vercel (hosting) + Azure SQL (database) = Best of both worlds! 🚀
