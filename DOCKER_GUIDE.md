# Docker Setup Guide

## Quick Start - Run Everything with One Command

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose up

# Or run in detached mode (background)
docker compose up -d
```

That's it! The entire application will be running:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **PostgreSQL:** localhost:5432

## What Gets Started

When you run `docker compose up`, three services start:

1. **postgres** - PostgreSQL 16 database
2. **backend** - Express.js API server
3. **frontend** - React development server

All services are connected via a Docker network and can communicate with each other.

## First Time Setup

### 1. Start Services

```bash
docker compose up -d
```

### 2. Wait for Services to be Ready

```bash
# Check if all services are running
docker compose ps

# You should see:
# vibesync-postgres   running
# vibesync-backend    running
# vibesync-frontend   running
```

### 3. Run Database Migrations

```bash
# Push database schema
docker compose exec backend npm run db:push
```

### 4. Access the Application

Open your browser:
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3001/health

## Common Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database data)
docker compose down -v
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart frontend
```

### Rebuild After Code Changes

```bash
# Rebuild and restart
docker compose up --build

# Rebuild specific service
docker compose up --build backend
```

### Execute Commands in Containers

```bash
# Backend commands
docker compose exec backend npm run db:push
docker compose exec backend npm run db:studio

# Frontend commands
docker compose exec frontend npm install <package>

# PostgreSQL commands
docker compose exec postgres psql -U vibesync -d vibesync_dev
```

## Development Workflow

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Vite watches for file changes
- **Backend:** tsx watch mode automatically restarts on changes

### Installing New Packages

```bash
# Backend
docker compose exec backend npm install <package-name>

# Frontend
docker compose exec frontend npm install <package-name>

# Then rebuild
docker compose up --build
```

### Database Management

```bash
# View database
docker compose exec postgres psql -U vibesync -d vibesync_dev

# Inside psql:
\dt                    # List tables
SELECT * FROM users;   # Query users
\q                     # Quit
```

## Troubleshooting

### Port Already in Use

```bash
# Error: Port 5173 or 3001 already in use
# Solution: Stop the service using the port

# Find process
lsof -ti:5173 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Or change ports in docker-compose.yml
```

### Services Not Starting

```bash
# Check logs
docker compose logs

# Remove containers and start fresh
docker compose down
docker compose up --build
```

### Database Connection Issues

```bash
# Check if PostgreSQL is healthy
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Check PostgreSQL logs
docker compose logs postgres
```

### Backend Can't Connect to Database

```bash
# The backend waits for PostgreSQL to be healthy
# Check if postgres service is running:
docker compose ps postgres

# If needed, restart backend after postgres is ready:
docker compose restart backend
```

### Frontend Build Errors

```bash
# Clear node_modules and rebuild
docker compose down
docker volume rm vibesync_frontend_node_modules
docker compose up --build frontend
```

## Production Deployment

For production, you'll want to:

1. **Build optimized images:**
```bash
docker compose -f docker-compose.prod.yml build
```

2. **Use environment variables:**
```bash
# Create .env file
cp .env.example .env
# Edit with production values
```

3. **Run in production mode:**
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

The docker-compose.yml includes all necessary environment variables:

- `DATABASE_URL` - PostgreSQL connection (uses service name `postgres`)
- `JWT_SECRET` - Change in production!
- `JWT_REFRESH_SECRET` - Change in production!
- `CORS_ORIGIN` - Frontend URL

## Volumes

Three volumes are created:
- `postgres_data` - Database persistence
- `backend_node_modules` - Backend dependencies
- `frontend_node_modules` - Frontend dependencies

To reset everything:
```bash
docker compose down -v
```

## Network

All services communicate via `vibesync-network`:
- Backend connects to `postgres:5432` (not localhost)
- Frontend makes API calls to `http://localhost:3001` (from browser)

## Tips

1. **Use `-d` flag** to run in background: `docker compose up -d`
2. **View logs** with: `docker compose logs -f`
3. **Rebuild after dependency changes**: `docker compose up --build`
4. **Keep volumes** when stopping: `docker compose down` (without `-v`)
5. **Clean slate**: `docker compose down -v && docker compose up --build`

## Comparison: Docker vs Local

### Docker (Recommended)
```bash
docker compose up
```
✅ One command starts everything  
✅ Consistent environment  
✅ No local Node.js/PostgreSQL needed  
✅ Easy cleanup  

### Local Development
```bash
# Terminal 1: PostgreSQL
cd backend && docker compose up -d

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```
✅ Faster hot reload  
✅ Direct file access  
✅ Easier debugging  

Choose based on your preference!
