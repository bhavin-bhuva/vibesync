#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Frontend Deployment..."

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Ensure we are in the frontend directory (if script run from root)
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    cd frontend
fi

echo "📦 Building project..."
npm run build

echo "✅ Build complete."

# Verify build output exists (React Router v7 SPA outputs to build/client)
if [ ! -d "build/client" ]; then
    echo "⚠️  Warning: 'build/client' directory not found."
    echo "   Checking for 'dist'..."
    if [ -d "dist" ]; then
        echo "   Found 'dist'. Please update firebase.json 'public' to 'dist'."
        # Auto-fix attempt? No, safest to warn.
    else
        echo "❌ No build output found (checked 'build/client' and 'dist')."
        exit 1
    fi
fi

# Confirm deployment
echo "🔥 Ready to deploy to Firebase Hosting."
# echo "   Project: $(grep '"default":' .firebaserc 2>/dev/null | cut -d '"' -f 4 || echo 'Not configured')"
# echo "Press Enter to continue or Ctrl+C to cancel..."
# read

echo "📤 Deploying..."
firebase deploy --only hosting

echo "🎉 Deployment Complete!"
echo "   Opening site..."
# firebase open hosting:site
