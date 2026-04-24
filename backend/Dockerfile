# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration and locks
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:22-slim
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only production dependencies and the built dist folder
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# Install ONLY production dependencies
RUN pnpm install --filter backend --prod --frozen-lockfile

EXPOSE 8080
WORKDIR /app/backend
# Use the direct path to avoid tsconfig-paths issues
CMD ["node", "dist/main.js"]