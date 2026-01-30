#!/bin/bash

# VibeSync Landing Page Deployment Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting VibeSync Landing Page Deployment...${NC}"

# Navigate to script directory
cd "$(dirname "$0")"

# 1. Check for Node.js/npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# 2. Check/Install Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠️ Firebase CLI not found. Installing globally...${NC}"
    npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install firebase-tools.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Firebase CLI is installed.${NC}"
fi

# 3. Login check
echo -e "${YELLOW}🔑 Verifying Firebase login...${NC}"
# This command just checks; if not logged in, it will prompt or fail mostly interactive
firebase login

# 4. Check for project association
if [ ! -f .firebaserc ]; then
    echo -e "${YELLOW}⚠️ No Firebase project linked to this directory.${NC}"
    echo "You need to associate this landing page with a Firebase project."
    echo "Running 'firebase use --add'..."
    firebase use --add
fi

# 5. Deploy
echo -e "${GREEN}📤 Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment Successful!${NC}"
else
    echo -e "${RED}❌ Deployment Failed.${NC}"
fi
