# 🚀 Azure Deployment Quick Start

## Step 1: Create Azure Service Principal

Run this command to create credentials for GitHub Actions:

```bash
az ad sp create-for-rbac \
  --name "vbms-github-actions" \
  --role contributor \
  --scopes /subscriptions/5e875b0e-0514-4c35-b9c8-251d16f6cbd0
```

**Save the output JSON** - you'll need it for the `AZURE_CREDENTIALS` secret.

---

## Step 2: Get Azure Publish Profile

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **App Services** > **vbms-app** (or create one)
3. Click **Get publish profile** (download button)
4. Open the `.publishsettings` file in a text editor
5. **Copy the entire content** - you'll need it for `AZURE_PUBLISH_PROFILE` secret

---

## Step 3: Add GitHub Secrets

### Via GitHub Web UI (Easiest):
1. Go to your GitHub repo: https://github.com/MapleSage/vbms
2. Click **Settings** tab
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:

| Secret Name | Value |
|---|---|
| `AZURE_CREDENTIALS` | Entire JSON from Step 1 |
| `AZURE_PUBLISH_PROFILE` | Entire content of .publishsettings file |
| `DATABASE_URL` | Your Azure SQL connection string |
| `BLOB_READ_WRITE_TOKEN` | Your Vercel Blob storage token |
| `AZURE_AI_ENDPOINT` | Your Azure AI Services endpoint |
| `AZURE_AI_PROJECT_KEY` | Your Azure AI project API key |
| `AZURE_AI_PROJECT_ID` | Your Azure AI project ID |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID |

### Via GitHub CLI (Alternative):

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Login
gh auth login

# Add secrets (replace YOUR_* with actual values)
gh secret set AZURE_CREDENTIALS -b "$(cat azure-credentials.json)"
gh secret set AZURE_PUBLISH_PROFILE -b "$(cat PublishSettings.publishsettings)"
gh secret set DATABASE_URL -b "YOUR_DATABASE_CONNECTION_STRING"
gh secret set BLOB_READ_WRITE_TOKEN -b "YOUR_VERCEL_BLOB_TOKEN"
gh secret set AZURE_AI_ENDPOINT -b "YOUR_AZURE_AI_ENDPOINT"
gh secret set AZURE_AI_PROJECT_KEY -b "YOUR_AZURE_AI_PROJECT_KEY"
gh secret set AZURE_AI_PROJECT_ID -b "YOUR_AZURE_AI_PROJECT_ID"
gh secret set AZURE_SUBSCRIPTION_ID -b "YOUR_AZURE_SUBSCRIPTION_ID"
```

---

## Step 4: Create/Update Azure App Service

```bash
# Create resource group
az group create \
  --name rg-vbms \
  --location eastus

# Create App Service plan (B1 tier - free eligible)
az appservice plan create \
  --name vbms-app-plan \
  --resource-group rg-vbms \
  --sku B1 \
  --is-linux

# Create Node.js web app
az webapp create \
  --resource-group rg-vbms \
  --plan vbms-app-plan \
  --name vbms-app \
  --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set \
  --resource-group rg-vbms \
  --name vbms-app \
  --settings \
    DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING" \
    BLOB_READ_WRITE_TOKEN="YOUR_VERCEL_BLOB_TOKEN" \
    AZURE_AI_ENDPOINT="YOUR_AZURE_AI_ENDPOINT" \
    AZURE_AI_PROJECT_KEY="YOUR_AZURE_AI_PROJECT_KEY" \
    AZURE_AI_PROJECT_ID="YOUR_AZURE_AI_PROJECT_ID" \
    AZURE_SUBSCRIPTION_ID="YOUR_AZURE_SUBSCRIPTION_ID" \
    NODE_ENV="production"
```

---

## Step 5: Trigger First Deployment

Once secrets are added, make a test commit:

```bash
cd "/Volumes/Macintosh HD Ext/VBMS"

# Make a small change to trigger workflow
echo "# Auto-deploy test" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger GitHub Actions deployment"
git push origin main
```

**Monitor the deployment:**
1. Go to GitHub: https://github.com/MapleSage/vbms/actions
2. Click the workflow run to see real-time logs
3. Wait ~3-5 minutes for build and deployment

---

## Step 6: Verify Deployment

```bash
# Check deployment status
az webapp show \
  --resource-group rg-vbms \
  --name vbms-app \
  --query "state"

# View real-time logs
az webapp log tail \
  --resource-group rg-vbms \
  --name vbms-app

# Test endpoint
curl https://vbms-app.azurewebsites.net/
```

---

## 📊 What Happens on Each Push

### On Push to `main`:

1. **CI Workflow triggers** (`.github/workflows/ci.yml`)
   - ✅ Installs dependencies
   - ✅ Runs linting
   - ✅ Builds Next.js app
   - ⏱️ ~2-3 minutes

2. **Deploy Workflow triggers** (`.github/workflows/deploy.yml`)
   - ✅ Generates Prisma Client
   - ✅ Builds application
   - ✅ Prepares deployment package
   - ✅ Authenticates to Azure
   - ✅ Deploys to App Service
   - ⏱️ ~3-5 minutes total

**Total time: ~5-8 minutes from push to live**

---

## 🔍 Troubleshooting

### "Missing secrets" error
- ✅ Check GitHub Settings > Secrets
- ✅ Verify all 8 secrets are added
- ✅ Wait 5 seconds after adding secrets for cache to refresh

### "Build failed: Cannot find module"
```bash
# Ensure node_modules are committed or dependencies are installed
cd vbms-app
npm ci
git add package-lock.json
git commit -m "fix: lock dependencies"
git push origin main
```

### "Deployment failed: 502 Bad Gateway"
```bash
# Check Azure logs
az webapp log tail --resource-group rg-vbms --name vbms-app

# Restart app
az webapp restart --resource-group rg-vbms --name vbms-app
```

### "Database connection failed"
```bash
# Verify connection string in secrets
gh secret list | grep DATABASE

# Test connection from local machine
cd vbms-app
DATABASE_URL="your-connection-string" npx prisma db push
```

---

## 🎉 Success Indicators

✅ Workflows show in GitHub Actions tab  
✅ CI workflow passes (all steps green)  
✅ Deploy workflow completes in ~5 minutes  
✅ App is accessible at https://vbms-app.azurewebsites.net  
✅ Logs show "Application started" in Azure  
✅ Database tables are created (from Prisma migrations)  

---

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Azure App Service Deployment Guide](https://learn.microsoft.com/azure/app-service/deploy-github-actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Full Setup Guide](./GITHUB-ACTIONS-SETUP.md)

---

## 🎯 Next Steps After Deployment

1. Disable "Automatic deployment" in Azure if using GitHub Actions
2. Set up branch protection rules (require CI to pass)
3. Monitor logs regularly: `az webapp log tail --resource-group rg-vbms --name vbms-app`
4. Set up email alerts for deployment failures
5. Schedule database backups

**Your app is now automatically deployed on every push to main! 🚀**
