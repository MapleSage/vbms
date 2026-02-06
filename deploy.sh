#!/bin/bash

echo "🚀 Van Booking & Fleet Management System - Deployment Script"
echo "============================================================"
echo ""

# Check if we're in the right directory
if [ ! -d "vbms-app" ]; then
    echo "❌ Error: vbms-app directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found vbms-app directory"
echo ""

# Navigate to app directory
cd vbms-app

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Ready to deploy to Vercel!"
    echo ""
    echo "Choose your deployment method:"
    echo ""
    echo "Option 1: Deploy with Vercel CLI"
    echo "  Run: vercel"
    echo ""
    echo "Option 2: Deploy via GitHub"
    echo "  1. Push to GitHub: git push origin main"
    echo "  2. Go to vercel.com/new"
    echo "  3. Import your repository"
    echo "  4. Set Root Directory to: vbms-app"
    echo "  5. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see: DEPLOY-VERCEL.md"
else
    echo ""
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
