# VibeSync

A modern, real-time chat application built with React, Express.js, and PostgreSQL.

## Project Structure

```
vibesync/
├── frontend/          # React frontend application
│   ├── app/          # React Router application code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Express.js backend API
│   ├── src/         # Backend source code
│   └── package.json # Backend dependencies
├── todo.md          # Project roadmap and tasks
├── vibesync-prd.md  # Product requirements document
├── vibesync-tech-rules.md  # Technical standards
└── README.md        # This file
```

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- Node.js 20.x or higher (for local development)
- npm or pnpm

### Option 1: Docker Compose (Recommended)

Run everything with one command:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose up

# Or run in detached mode
docker compose up -d

# First time only: Push database schema
docker compose exec backend npm run db:push
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1
- Health Check: http://localhost:3001/health

**Useful commands:**
```bash
docker compose logs -f          # View logs
docker compose down             # Stop services
docker compose up --build       # Rebuild and start
```

See [Docker Guide](/.gemini/antigravity/brain/327f1202-46aa-4ce8-b335-2a1fac3eae85/DOCKER_GUIDE.md) for detailed instructions.

### Option 2: Local Development

Run services individually:

```bash
# 1. Start PostgreSQL with Docker
cd backend
docker compose up -d

# 2. Install dependencies
npm install

# 3. Push database schema
npm run db:push

# 4. Start backend server
npm run dev
# Backend runs on http://localhost:3001
```

### Frontend Setup

```bash
# In a new terminal
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api/v1
- **Health Check:** http://localhost:3001/health

## Documentation

- **[Docker Guide](DOCKER_GUIDE.md)** - Run with Docker Compose (recommended)
- **[Setup Guide](/.gemini/antigravity/brain/327f1202-46aa-4ce8-b335-2a1fac3eae85/SETUP_GUIDE.md)** - Local development setup
- **[Walkthrough](/.gemini/antigravity/brain/327f1202-46aa-4ce8-b335-2a1fac3eae85/walkthrough.md)** - Implementation details
- **[PRD](vibesync-prd.md)** - Product requirements
- **[Tech Rules](vibesync-tech-rules.md)** - Technical standards
- **[Todo](todo.md)** - Project roadmap

## Tech Stack

### Frontend
- React 19.2.3
- React Router 7.12.0
- TypeScript 5.9.2
- TailwindCSS 4.1.13
- Vite 7.1.7

### Backend
- Express.js 5.2.1
- PostgreSQL 16
- Drizzle ORM 0.45.1
- TypeScript 5.9.2
- JWT Authentication
- bcrypt for password hashing

## Features

### ✅ Phase 1 Complete (MVP)
- ✅ User authentication (register/login)
- ✅ JWT token management with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Friend code generation (17-character format)
- ✅ Form validation with Zod
- ✅ Error handling and logging
- ✅ **Friend Management System**
  - Send/receive friend requests
  - Accept/decline requests
  - Friend list management
  - QR code sharing
  - Real-time friend status
- ✅ **User Profile Management**
  - Real user data integration
  - Profile updates
  - Avatar support
  - Status messages
- ✅ **UI/UX**
  - Responsive design
  - Dark mode
  - Loading states
  - Error handling
  - Empty states

### 🚧 Phase 2 In Progress
- ✅ **Real-time messaging (Socket.io)**
  - Instant message delivery
  - Real-time conversation list updates
  - Online/Offline status updates
- ✅ Message persistence (PostgreSQL + Drizzle)
- ⏳ Read receipts
- ⏳ Typing indicators
- ✅ Friend management API (Complete)
- ✅ User data API (Complete)

## Development

### Backend Commands

```bash
cd backend
npm run dev                # Start development server
npm run build              # Build for production
npm run db:push            # Push schema to database
npm run db:generate        # Generate migrations
npm run db:studio          # Open Drizzle Studio
npm run migrate:friendcodes # Migrate friend codes (one-time)
```

### Frontend Commands

```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run typecheck  # Run TypeScript checks
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://vibesync:vibesync_dev_password@localhost:5432/vibesync_dev
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:5173
PORT=3001
```

### Frontend
No environment variables required for development.

## Testing

### Backend API Testing

```bash
# Register a user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## License

ISC

## Author

Bhavin
