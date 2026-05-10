#!/bin/bash

# ThesisAI Deployment Script

set -e

echo "🚀 Starting ThesisAI Deployment..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build application
echo "🔨 Building application..."
npm run build

# Run tests (if needed)
echo "✅ Build successful!"

echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy to Vercel: https://vercel.com/new"
echo "3. Add OPENAI_API_KEY environment variable"
echo "4. Click Deploy!"
echo ""
echo "🎉 Your app will be live in 2-3 minutes!"
