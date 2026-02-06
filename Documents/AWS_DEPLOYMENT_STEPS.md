# VibeSync AWS Deployment Guide

**Target:** Production deployment for MVP (~20 users)  
**Cost:** ₹900–1,000/month  
**Architecture:** EC2 + Free PostgreSQL (Neon) + Firebase Hosting

---

## Prerequisites

Before starting, ensure you have:

- [ ] AWS Account with billing configured
- [ ] Domain name (optional but recommended)
- [ ] AWS CLI installed and configured locally
- [ ] Docker installed locally for building images
- [ ] SSH key pair for EC2 access

---

## Phase 1: Database Setup (Free PostgreSQL)

### Option A: Neon (Recommended)

1. **Create Neon Account**
   - Visit https://neon.tech
   - Sign up for free tier
   - Create a new project: `vibesync-production`

2. **Get Database Connection String**
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/vibesync?sslmode=require
   ```

3. **Save Connection Details**
   - Store `DATABASE_URL` securely
   - Note: Free tier includes ~0.5 GB storage, auto-sleep when idle

### Option B: Supabase

1. **Create Supabase Account**
   - Visit https://supabase.com
   - Sign up for free tier
   - Create new project: `vibesync-production`

2. **Get Database Connection String**
   - Go to Project Settings → Database
   - Copy connection string (URI format)
   - Enable SSL mode

3. **Configure Connection Pool**
   - Set max connections: 2-5 (free tier limit)
   - Enable connection pooling in Supabase dashboard

---

## Phase 2: EC2 Instance Setup

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Navigate to EC2 Dashboard
   - Select region: `ap-south-1` (Mumbai) for India

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name:** `vibesync-backend-prod`
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type:** `t3.micro` (2 vCPU, 1 GB RAM)
   - **Key Pair:** Create new or select existing
   - **Network Settings:**
     - Auto-assign public IP: Enable
     - Security Group: Create new

3. **Configure Security Group**
   
   Create rules:
   ```
   Type            Protocol    Port Range    Source
   SSH             TCP         22            Your IP (or 0.0.0.0/0)
   HTTP            TCP         80            0.0.0.0/0
   HTTPS           TCP         443           0.0.0.0/0
   Custom TCP      TCP         3001          0.0.0.0/0 (temporary, will restrict later)
   ```

4. **Storage**
   - Root volume: 8 GB gp3 (default)
   - This is sufficient for MVP

5. **Launch Instance**
   - Review and launch
   - Download `.pem` key file if new

### Step 2: Connect to EC2

```bash
# Set key permissions
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 3: Install Docker on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Logout and login again for group changes
exit
```

Reconnect to EC2:
```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 4: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Phase 3: Deploy Backend to EC2

### Step 1: Prepare Production Files

On your **local machine**:

1. **Create production docker-compose file**

Create `docker-compose.ec2.yml` in project root:

```yaml
services:
  # Backend API (Production)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: vibesync-backend-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_CALLBACK_URL: ${GOOGLE_CALLBACK_URL}
    ports:
      - "3001:3001"
    networks:
      - vibesync-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  vibesync-network:
    driver: bridge
```

2. **Create production Dockerfile**

Create `backend/Dockerfile.prod`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and lockfile
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
```

3. **Create .env.production file**

Create `backend/.env.production`:

```env
NODE_ENV=production
PORT=3001

# Database (from Neon/Supabase)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-production

# CORS
CORS_ORIGIN=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/auth/google/callback

# Redis (if using)
# REDIS_URL=redis://localhost:6379
```

### Step 2: Transfer Files to EC2

```bash
# Create deployment directory on EC2
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP> "mkdir -p ~/vibesync"

# Transfer backend code
scp -i your-key.pem -r ./backend ubuntu@<EC2_PUBLIC_IP>:~/vibesync/

# Transfer docker-compose.ec2.yml
scp -i your-key.pem docker-compose.ec2.yml ubuntu@<EC2_PUBLIC_IP>:~/vibesync/

# Transfer .env.production
scp -i your-key.pem backend/.env.production ubuntu@<EC2_PUBLIC_IP>:~/vibesync/backend/.env
```

### Step 3: Build and Run on EC2

SSH into EC2:
```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

On EC2:
```bash
# Navigate to project
cd ~/vibesync

# Build and start backend
docker compose -f docker-compose.ec2.yml up -d --build

# Check logs
docker compose -f docker-compose.ec2.yml logs -f backend

# Verify backend is running
curl http://localhost:3001/health
```

### Step 4: Run Database Migrations

```bash
# On EC2, run migrations
docker compose -f docker-compose.ec2.yml exec backend npm run db:push

# Or if using migrations
docker compose -f docker-compose.ec2.yml exec backend npm run migrate
```

---

## Phase 4: Configure Nginx Reverse Proxy

### Step 1: Create Nginx Configuration

On EC2:

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/vibesync
```

Add this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;  # Change to your domain

    # Increase body size for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Step 2: Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/vibesync /etc/nginx/sites-enabled/

# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 3: Test Backend API

```bash
# From your local machine
curl http://<EC2_PUBLIC_IP>/health

# Should return: {"status":"ok"}
```

---

## Phase 5: SSL Certificate (Let's Encrypt)

### Step 1: Install Certbot

On EC2:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Configure DNS

Before getting SSL certificate:

1. Go to your domain registrar
2. Add A record:
   ```
   Type: A
   Name: api
   Value: <EC2_PUBLIC_IP>
   TTL: 300
   ```
3. Wait 5-10 minutes for DNS propagation

### Step 3: Get SSL Certificate

```bash
# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

### Step 4: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-renewal is enabled by default
# Check timer
sudo systemctl status certbot.timer
```

---

## Phase 6: Frontend Deployment (Firebase Hosting)

### Why Firebase Hosting?

- ✅ **Free** for MVP scale (no cost!)
- ✅ **Fast setup** - Deploy in minutes
- ✅ **Global CDN** - Powered by Google's infrastructure
- ✅ **Free SSL** - Automatic HTTPS
- ✅ **SPA support** - Built-in routing fallback
- ✅ **Easy rollbacks** - Version history included

### Step 1: Install Firebase CLI

On your **local machine**:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Step 2: Create Firebase Project

1. **Via Firebase Console:**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - **Project name:** `vibesync-production`
   - Disable Google Analytics (optional for MVP)
   - Create project

2. **Or via CLI:**
   ```bash
   firebase projects:create vibesync-production
   ```

### Step 3: Initialize Firebase in Your Project

Navigate to your frontend directory:

```bash
cd frontend

# Initialize Firebase Hosting
firebase init hosting
```

**Configuration prompts:**

```
? Please select an option: Use an existing project
? Select a default Firebase project: vibesync-production

? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? No
? File dist/index.html already exists. Overwrite? No
```

### Step 4: Configure Firebase Hosting

The `firebase init` command creates `firebase.json`. Verify it looks like this:

**frontend/firebase.json:**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Update Frontend Environment Variables

Create **frontend/.env.production**:

```env
# Production API URL
VITE_API_URL=https://api.yourdomain.com

# Or use EC2 public IP temporarily
# VITE_API_URL=http://<EC2_PUBLIC_IP>
```

### Step 6: Deploy Frontend

We have created a helper script to handle the build and deployment process.

```bash
# From project root
./frontend/deploy.sh

# Or manually:
# cd frontend
# npm run build
# firebase deploy --only hosting
```

**Output will show:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/vibesync-production/overview
Hosting URL: https://vibesync-production.web.app
```

### Step 7: Configure Custom Domain (Optional)

If you have a custom domain:

1. **Via Firebase Console:**
   - Go to Hosting → Add custom domain
   - Enter your domain: `yourdomain.com`
   - Follow DNS configuration instructions
   - Add TXT record for verification
   - Add A records pointing to Firebase

2. **DNS Records to add:**
   ```
   Type: A
   Name: @
   Value: 151.101.1.195
   
   Type: A
   Name: @
   Value: 151.101.65.195
   
   Type: CNAME
   Name: www
   Value: vibesync-production.web.app
   ```

3. **SSL Certificate:**
   - Firebase automatically provisions SSL
   - Wait 24-48 hours for propagation
   - Certificate auto-renews

### Step 8: Update Backend CORS

On **EC2**, update backend environment:

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
cd ~/vibesync/backend
nano .env
```

Update CORS origin:

```env
# If using Firebase default domain
CORS_ORIGIN=https://vibesync-production.web.app

# If using custom domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# For development (remove in production)
# CORS_ORIGIN=http://localhost:5173,https://vibesync-production.web.app
```

Restart backend:

```bash
cd ~/vibesync
docker compose -f docker-compose.ec2.yml restart backend
```

### Step 9: Test Deployment

1. **Visit your Firebase URL:**
   ```
   https://vibesync-production.web.app
   ```

2. **Test API connectivity:**
   - Open browser console
   - Check network requests
   - Verify API calls to backend

3. **Test authentication:**
   - Try Google OAuth login
   - Verify JWT tokens

### Step 10: Configure Firebase Hosting Settings

**Optional optimizations:**

1. **Enable compression:**
   Already enabled by default (gzip/brotli)

2. **Set up preview channels (for staging):**
   ```bash
   # Deploy to preview channel
   firebase hosting:channel:deploy staging
   ```

3. **View deployment history:**
   ```bash
   firebase hosting:releases:list
   ```

4. **Rollback if needed:**
   - Go to Firebase Console → Hosting
   - Click on previous deployment
   - Click "Rollback"

---

## Phase 7: Post-Deployment Configuration

### Step 1: Update CORS Settings

On EC2, update backend `.env`:

```bash
cd ~/vibesync/backend
nano .env
```

Update:
```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Restart backend:
```bash
cd ~/vibesync
docker compose -f docker-compose.ec2.yml restart backend
```

### Step 2: Configure Google OAuth

1. Go to Google Cloud Console
2. Update OAuth Redirect URIs:
   ```
   https://api.yourdomain.com/auth/google/callback
   https://yourdomain.com/auth/callback
   ```

### Step 3: Security Group Hardening

Update EC2 Security Group:

```
Remove: Port 3001 from 0.0.0.0/0
Add: Port 3001 from Security Group ID (self-reference)

This ensures backend is only accessible via Nginx
```

### Step 4: Enable CloudWatch Logging (Optional)

```bash
# On EC2, install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure (follow prompts)
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

---

## Phase 8: Monitoring & Maintenance

### Health Checks

Create `health-check.sh` on EC2:

```bash
#!/bin/bash
# Health check script

# Check backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down - restarting"
    cd ~/vibesync && docker compose -f docker-compose.ec2.yml restart backend
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is down - restarting"
    sudo systemctl restart nginx
fi
```

Make executable and add to cron:
```bash
chmod +x ~/health-check.sh

# Add to crontab (run every 5 minutes)
crontab -e

# Add line:
*/5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/health-check.log 2>&1
```

### Backup Strategy

```bash
# Database backup (from Neon/Supabase dashboard)
# - Enable automatic backups
# - Set retention: 7 days

# Application logs
# - Docker logs: max 10MB, 3 files (already configured)
# - Nginx logs: rotate weekly
sudo nano /etc/logrotate.d/nginx
```

### Update Deployment Script

Create `deploy.sh` on local machine:

```bash
#!/bin/bash
# Quick deployment script

set -e

echo "🚀 Building frontend..."
cd frontend
npm run build

echo "📦 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Frontend deployed!"

# Backend deployment
echo "🔧 Deploying backend..."
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP> << 'EOF'
  cd ~/vibesync
  git pull origin main  # If using git
  docker compose -f docker-compose.ec2.yml up -d --build backend
  docker compose -f docker-compose.ec2.yml exec backend npm run db:push
EOF

echo "✅ Backend deployed!"
echo "🌐 Frontend: https://vibesync-production.web.app"
echo "🔌 Backend: https://api.yourdomain.com"
```

---

## Cost Optimization Tips

### 1. Stop EC2 During Off-Hours (Optional)

If not 24/7 critical:

```bash
# Stop instance (from local machine)
aws ec2 stop-instances --instance-ids i-xxxxx

# Start instance
aws ec2 start-instances --instance-ids i-xxxxx
```

**Savings:** 30-50% on EC2 costs

### 2. CloudWatch Log Retention

```bash
# Set retention to 7 days
aws logs put-retention-policy \
  --log-group-name /aws/ec2/vibesync \
  --retention-in-days 7
```

### 3. S3 Lifecycle Policy

Create lifecycle rule to delete old logs after 30 days.

---

## Troubleshooting

### Backend Not Accessible

```bash
# Check if container is running
docker ps

# Check logs
docker compose -f docker-compose.ec2.yml logs backend

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

### Database Connection Issues

```bash
# Test connection from EC2
docker compose -f docker-compose.ec2.yml exec backend sh
# Inside container:
npm run db:push
```

### Frontend Not Loading

```bash
# Check Firebase deployment status
firebase hosting:releases:list

# Check build output
ls -la frontend/dist/

# Redeploy
cd frontend
npm run build
firebase deploy --only hosting

# Check Firebase console for errors
# https://console.firebase.google.com

# Clear browser cache and test in incognito mode
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

---

## Rollback Plan

### Backend Rollback

```bash
# On EC2
cd ~/vibesync

# Stop current version
docker compose -f docker-compose.ec2.yml down

# Restore previous image
docker compose -f docker-compose.ec2.yml up -d

# Or restore from backup
```

### Frontend Rollback

```bash
# On local machine or via Firebase Console
# List previous versions
firebase hosting:releases:list

# Rollback to specific version (e.g., v1)
firebase hosting:channel:deploy --version v1

# OR simply redeploy the previous stable build
# ... restore code ...
firebase deploy --only hosting

# Easiest way:
# Go to Firebase Console -> Hosting -> Dashboard
# Find previous release -> Click three dots -> "Rollback"
```

---

## Scaling Plan (When to Upgrade)

Upgrade when:

- **Users > 200**
- **Database > 5-10 GB**
- **Consistent high traffic**
- **Need better performance**

### Migration Path:

1. **Database:** Neon Free → Neon Pro or AWS RDS
2. **Backend:** t3.micro → t3.small or t3.medium
3. **Add:** Load balancer, auto-scaling, Redis cache
4. **Add:** CloudWatch alarms, SNS notifications

---

## Monthly Costs Breakdown

| Component           | Cost (₹/month) |
|---------------------|----------------|
| EC2 t3.micro        | ₹800           |
| PostgreSQL (Neon)   | ₹0 (Free tier) |
| Firebase Hosting    | ₹0 (Free tier) |
| Data Transfer       | ₹50            |
| CloudWatch Logs     | ₹50            |
| **Total**           | **₹900**       |

**Note:** This is significantly cheaper than S3 + CloudFront, saving ~₹150-200/month!

---

## Checklist

### Pre-Deployment
- [ ] Database created (Neon/Supabase)
- [ ] Domain name configured
- [ ] AWS account ready
- [ ] SSL certificate plan
- [ ] Environment variables prepared

### EC2 Setup
- [ ] Instance launched (t3.micro)
- [ ] Security group configured
- [ ] Docker installed
- [ ] Nginx installed
- [ ] SSH access verified

### Backend Deployment
- [ ] Code transferred to EC2
- [ ] Docker containers running
- [ ] Database migrations completed
- [ ] Health check passing
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed

### Frontend Deployment
- [ ] Firebase project created
- [ ] Firebase CLI installed & logged in
- [ ] Firebase hosting initialized
- [ ] Build deployed successfully
- [ ] Custom domain (optional) configured

### Post-Deployment
- [ ] CORS updated
- [ ] Google OAuth configured
- [ ] Security group hardened
- [ ] Monitoring enabled
- [ ] Backup strategy implemented
- [ ] Health checks automated

---

## Support & Resources

- **AWS Documentation:** https://docs.aws.amazon.com
- **Firebase Hosting:** https://firebase.google.com/docs/hosting
- **Neon Docs:** https://neon.tech/docs
- **Docker Docs:** https://docs.docker.com
- **Nginx Docs:** https://nginx.org/en/docs
- **Let's Encrypt:** https://letsencrypt.org

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Production URL:** https://vibesync.co.in  
**API URL:** https://api.vibesync.co.in
