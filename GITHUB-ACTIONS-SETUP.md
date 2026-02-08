# GitHub Actions Deployment Guide

## Overview

This project uses GitHub Actions to automate building, testing, and deployment to Azure. Two workflows are configured:

1. **CI Workflow** (`ci.yml`) - Triggered on push to main/develop and PRs
   - Installs dependencies
   - Runs linting
   - Builds the application
   - Runs tests

2. **Deploy Workflow** (`deploy.yml`) - Triggered on push to main
   - Builds the application
   - Prepares deployment package
   - Deploys to Azure App Service

## Setup Instructions

### 1. Azure Credentials Setup

First, create Azure credentials for GitHub Actions:

```bash
# Create a service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "vbms-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}
```

This will output JSON including `clientId`, `clientSecret`, `subscriptionId`, and `tenantId`.

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

**Required Secrets:**
- `AZURE_CREDENTIALS` - JSON from service principal (entire output)
- `AZURE_PUBLISH_PROFILE` - Download from Azure Portal:
  1. Go to your App Service
  2. Click "Get publish profile"
  3. Open the .publishsettings file
  4. Paste entire content as secret value

**Database & Configuration Secrets:**
- `DATABASE_URL` - Your Azure SQL connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `AZURE_AI_ENDPOINT` - Azure AI Services endpoint
- `AZURE_AI_PROJECT_KEY` - Azure AI project API key
- `AZURE_AI_PROJECT_ID` - Azure AI project ID
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID

### 3. Add Secrets via GitHub CLI (Recommended)

```bash
# Login to GitHub CLI
gh auth login

# Set repository
gh secret set AZURE_CREDENTIALS -b "$(cat azure-credentials.json)"
gh secret set AZURE_PUBLISH_PROFILE -b "$(cat PublishSettings.publishsettings)"
gh secret set DATABASE_URL -b "your-connection-string"
gh secret set BLOB_READ_WRITE_TOKEN -b "your-blob-token"
gh secret set AZURE_AI_ENDPOINT -b "your-ai-endpoint"
gh secret set AZURE_AI_PROJECT_KEY -b "your-project-key"
gh secret set AZURE_AI_PROJECT_ID -b "your-project-id"
gh secret set AZURE_SUBSCRIPTION_ID -b "your-subscription-id"
```

### 4. Azure App Service Setup

Ensure your Azure App Service is configured:

```bash
# Create resource group (if needed)
az group create --name rg-vbms --location eastus

# Create App Service plan
az appservice plan create \
  --name vbms-plan \
  --resource-group rg-vbms \
  --sku B1 \
  --is-linux

# Create Node.js app
az webapp create \
  --resource-group rg-vbms \
  --plan vbms-plan \
  --name vbms-app \
  --runtime "NODE|18-lts"

# Set app settings
az webapp config appsettings set \
  --resource-group rg-vbms \
  --name vbms-app \
  --settings DATABASE_URL="your-connection-string"
```

## Workflow Details

### CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when files in `vbms-app/` change

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (npm ci)
4. Run ESLint
5. Build Next.js application
6. Verify build artifacts

### Deploy Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Only when files in `vbms-app/` change

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Generate Prisma Client
5. Build application
6. Prepare deployment package:
   - Copy `.next` build output
   - Copy `node_modules`
   - Copy configuration files
   - Create `web.config` for IIS
7. Login to Azure
8. Deploy using `azure/webapps-deploy@v2`
9. Verify deployment

## Manual Deployment

If you need to deploy manually:

```bash
# Publish to Azure using Azure CLI
az webapp up --name vbms-app --runtime "node|18-lts"

# Or deploy using GitHub CLI
gh workflow run deploy.yml

# Check workflow status
gh workflow view deploy.yml --json status
```

## Troubleshooting

### Build Failures

**Issue:** "Cannot find module 'prisma'"
```bash
# Solution: Ensure prisma is in package.json dependencies
npm install --save @prisma/client prisma
git push origin main  # Trigger workflow
```

**Issue:** Database connection failure
```bash
# Solution: Verify DATABASE_URL secret is set correctly
gh secret list | grep DATABASE
```

### Deployment Failures

**Issue:** "App settings not found"
```bash
# Solution: Ensure all required app settings are configured
az webapp config appsettings list --resource-group rg-vbms --name vbms-app
```

**Issue:** "Deployment package too large"
```bash
# Solution: Add .deploymentignore file in vbms-app/
node_modules/
.next/
out/
```

## Monitoring Deployments

### GitHub Actions Dashboard
- Go to Actions tab in your GitHub repository
- View workflow runs and logs
- Click on a run to see detailed logs

### Azure Portal
- Navigate to your App Service
- Go to Deployment Center
- View deployment history
- Check logs in Log Stream

### View Real-Time Logs
```bash
az webapp log tail --resource-group rg-vbms --name vbms-app
```

## Environment Variables

Environment variables are set in two places:

1. **Build Time** (GitHub Actions secrets)
   - Used during `npm run build`

2. **Runtime** (Azure App Service settings)
   - Add via Azure Portal or CLI after deployment

Example setting runtime variables:
```bash
az webapp config appsettings set \
  --resource-group rg-vbms \
  --name vbms-app \
  --settings \
    BLOB_READ_WRITE_TOKEN="your-token" \
    AZURE_AI_ENDPOINT="your-endpoint" \
    AZURE_AI_PROJECT_KEY="your-key"
```

## Next Steps

1. ✅ Commit workflow files: `git add .github && git commit -m "ci: add GitHub Actions workflows"`
2. ✅ Push to GitHub: `git push origin main`
3. ✅ Add secrets to repository
4. ✅ Verify first deployment in Actions tab
5. ✅ Monitor logs and fix any issues
6. ✅ Set up branch protection rules (optional)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure App Service Deployment](https://learn.microsoft.com/azure/app-service/deploy-github-actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides)
