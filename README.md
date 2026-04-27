# Veracity Blog

A modern, full-stack blogging platform built with NestJS, React, and WebAuthn.

## 🚀 Overview

Veracity Blog is a high-performance blogging application featuring:
- **Backend:** NestJS, Prisma, tRPC, WebAuthn.
- **Frontend:** React, Vite, TanStack Router/Query/Form, Tailwind CSS (v4).
- **Database:** PostgreSQL.

## 📋 Planning & Design

- **Planning Board:** [Figjam Board](https://www.figma.com/board/0aFyA4H7Q44UCVIHAgbXmi/Untitled?node-id=36-373&t=6IX9D3rHec2Y7pm0-4)
- **Detailed Specs:** Architectural decisions and feature designs can be found in the `docs/superpowers/specs/` directory.

## 🛠 Prerequisites

- **Node.js:** >= 20.0.0
- **pnpm:** For workspace management.
- **Docker:** For running infrastructure (PostgreSQL, pgAdmin).

## ⚙️ Local Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd veracity-blog
pnpm install
```

### 2. Infrastructure
Start the database and pgAdmin using Docker Compose:
```bash
docker-compose up -d
```

### 3. Environment Variables
Create `.env` files for both backend and frontend.

**Backend (`backend/.env`):**
```env
PORT=8080
FRONTEND_URL=http://localhost:5173
DATABASE_USER=postgres
DATABASE_PASSWORD=local_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=veracity_db
DATABASE_URL=postgresql://postgres:local_password@localhost:5432/veracity_db?schema=public
JWT_SECRET=your_32_character_jwt_secret_here_at_least
COOKIE_SECRET=your_32_character_cookie_secret_here_at_least
```

**Frontend (`frontend/.env`):**
```env
VITE_BACKEND_URL=http://localhost:8080
```

### 4. Database Initialization
Apply migrations and seed the database with initial data:
```bash
# Apply migrations
pnpm --filter backend prisma:migrate

# Seed data (10 users, 100 blog posts)
pnpm --filter backend prisma:seed
```

## 🏃 Running the Project

### Development Mode
Start both backend and frontend in watch mode:
```bash
# Backend
pnpm --filter backend start:dev

# Frontend
pnpm --filter frontend dev
```

### Production Mode
Build and run the production versions:
```bash
# Build both
pnpm --filter backend build
pnpm --filter frontend build

# Start production backend
pnpm --filter backend start:prod

# Preview production frontend
pnpm --filter frontend preview
```

## 🔐 Infrastructure Credentials

| Service | Credential Type | Value |
|---------|-----------------|-------|
| **PostgreSQL** | User | `postgres` |
| | Password | `local_password` |
| | DB Name | `veracity_db` |
| | Port | `5432` |
| **pgAdmin** | Email | `admin@veracity.com` |
| | Password | `admin` |
| | URL | `http://localhost:5050` |
