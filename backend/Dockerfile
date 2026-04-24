# Stage 1: Build
FROM node:25-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --filter backend

# Copy backend source
COPY backend ./backend

# Build the app
WORKDIR /app/backend
RUN pnpm run build

# Stage 2: Production
FROM node:25-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main.js"]