# Project Design: Repository README

This specification outlines the content and structure of the main `README.md` file for the Veracity Blog repository.

## 1. Overview
The README will serve as the primary entry point for developers. It will provide a project overview, setup instructions, and reference links.

## 2. Content Structure

### 2.1 Title & Description
- **Title:** Veracity Blog
- **Description:** A modern, full-stack blogging platform built with NestJS, React, and WebAuthn.

### 2.2 Planning & Design
- **Figjam Board:** Link to the planning board.
- **Specs & Plans:** Mention the `docs/` directory for detailed architecture and design specs.

### 2.3 Prerequisites
- Node.js (>= 20.0.0)
- pnpm
- Docker & Docker Compose

### 2.4 Local Setup
1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   pnpm install
   ```
2. **Infrastructure:**
   - Run `docker-compose up -d` for PostgreSQL and pgAdmin.
3. **Environment Variables:**
   - Detailed `.env` examples for both `/backend` and `/frontend`.
4. **Database Initialization:**
   - `pnpm --filter backend prisma:migrate`
   - `pnpm --filter backend prisma:seed`

### 2.5 Development Workflow
- Backend: `pnpm --filter backend start:dev`
- Frontend: `pnpm --filter frontend dev`

### 2.6 Production Workflow
- **Build:** `pnpm --filter backend build` and `pnpm --filter frontend build`.
- **Start:** `pnpm --filter backend start:prod` and `pnpm --filter frontend preview`.

### 2.7 Database Credentials
- List defaults from `docker-compose.yml`.

## 3. Environment Variable Examples

### Backend (`backend/.env`)
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

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:8080
```

## 4. Technical Details
- **Backend:** NestJS, Prisma, tRPC, WebAuthn.
- **Frontend:** React, Vite, TanStack Router/Query/Form, Tailwind CSS (v4).
- **Database:** PostgreSQL.
