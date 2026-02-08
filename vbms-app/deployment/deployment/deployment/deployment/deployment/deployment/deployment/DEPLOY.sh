#!/bin/bash

# VBMS Application - Complete Deployment Script
# This script will set up and deploy your VBMS application

set -e  # Exit on error

echo "🚀 VBMS Deployment Script"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the vbms-app directory."
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Check environment variables
echo "🔧 Step 2: Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your Azure credentials before continuing."
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - AZURE_AD_CLIENT_ID"
    echo "   - AZURE_AD_CLIENT_SECRET"
    echo "   - AZURE_AD_TENANT_ID"
    echo ""
    read -p "Press Enter after you've configured .env..."
fi
echo "✅ Environment configured"
echo ""

# Step 3: Generate Prisma client
echo "🗄️  Step 3: Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Step 4: Push database schema
echo "🗄️  Step 4: Pushing database schema to Azure SQL..."
echo "⚠️  This will create tables in your database."
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo "✅ Database schema pushed"
else
    echo "⏭️  Skipped database push"
fi
echo ""

# Step 5: Seed database (optional)
echo "🌱 Step 5: Seed database with sample data? (optional)"
read -p "Seed database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo "✅ Database seeded"
else
    echo "⏭️  Skipped database seeding"
fi
echo ""

# Step 6: Build application
echo "🏗️  Step 6: Building application..."
npm run build
echo "✅ Application built"
echo ""

# Step 7: Test locally
echo "🧪 Step 7: Ready to test locally"
echo "Run: npm run dev"
echo "Then visit: http://localhost:3000"
echo ""

# Step 8: Deploy options
echo "🚀 Step 8: Deployment Options"
echo ""
echo "Choose your deployment method:"
echo "1) Deploy to Vercel (recommended)"
echo "2) Deploy to Azure App Service"
echo "3) Skip deployment (test locally first)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📤 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        echo ""
        echo "⚠️  Make sure to add environment variables in Vercel dashboard:"
        echo "   - DATABASE_URL"
        echo "   - NEXTAUTH_SECRET"
        echo "   - NEXTAUTH_URL (your vercel domain)"
        echo "   - AZURE_AD_CLIENT_ID"
        echo "   - AZURE_AD_CLIENT_SECRET"
        echo "   - AZURE_AD_TENANT_ID"
        echo ""
        read -p "Press Enter to continue with Vercel deployment..."
        vercel
        echo ""
        echo "✅ Deployed to Vercel!"
        echo "🔗 Update your Azure AD redirect URI with the Vercel URL"
        ;;
    2)
        echo ""
        echo "📤 Deploying to Azure App Service..."
        if ! command -v az &> /dev/null; then
            echo "❌ Azure CLI not found. Please install it first:"
            echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
            exit 1
        fi
        
        echo "Logging into Azure..."
        az login
        
        read -p "Enter resource group name: " rg
        read -p "Enter app name: " appname
        
        echo "Creating App Service..."
        az webapp up --name $appname --resource-group $rg --runtime "NODE:18-lts"
        
        echo "✅ Deployed to Azure!"
        echo "🔗 URL: https://$appname.azurewebsites.net"
        ;;
    3)
        echo "⏭️  Skipping deployment"
        echo "Run 'npm run dev' to test locally"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "=========================="
echo "✅ Setup Complete!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Create your first booking!"
echo ""
echo "Documentation:"
echo "- Setup: SETUP.md"
echo "- API: Check /app/api/ folder"
echo "- Database: Run 'npx prisma studio' to view data"
echo ""
