# Stage 1: Build
FROM node:22-slim AS builder
# Install openssl for Prisma engines 
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration and locks
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/

# 1. Install dependencies with --ignore-scripts
# This prevents the "postinstall: prisma generate" from running 
# before the schema and config files are copied 
RUN pnpm install --frozen-lockfile --ignore-scripts

# 2. Copy the rest of the source code first
# This ensures src/config/prisma.config.ts and backend/prisma/schema.prisma exist 
COPY . .

# 3. Explicitly run Prisma Generate using your custom config
# We run this after the copy so the paths are resolved correctly 
RUN pnpm --filter backend exec prisma generate --config src/config/prisma.config.ts

# 4. Build the NestJS source 
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:22-slim
# Production environment also needs openssl to run the Prisma engine
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production artifacts
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# IMPORTANT: Copy the generated client from the custom output path 
COPY --from=builder /app/backend/src/generated ./backend/src/generated
COPY --from=builder /app/backend/prisma ./backend/prisma/

# Install ONLY production dependencies 
# We use --ignore-scripts here as well to avoid redundant generation attempts
RUN pnpm install --filter backend --prod --frozen-lockfile --ignore-scripts

EXPOSE 8080
WORKDIR /app/backend
CMD ["node", "dist/main.js"]