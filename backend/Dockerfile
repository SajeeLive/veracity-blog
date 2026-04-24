# Stage 1: Build
FROM node:22-slim AS builder
# Install openssl for Prisma engines
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration and locks
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the Prisma schema and generate the client
# This must happen before building the NestJS source
COPY backend/prisma ./backend/prisma/
RUN pnpm --filter backend exec prisma generate

# Copy source and build
COPY . .
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:22-slim
# Production environment also needs openssl to run the Prisma engine
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only production dependencies and the built dist folder
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
# You MUST copy the generated client from the builder stage
COPY --from=builder /app/backend/src/generated ./backend/src/generated
COPY --from=builder /app/backend/prisma ./backend/prisma/

# Install ONLY production dependencies
RUN pnpm install --filter backend --prod --frozen-lockfile

EXPOSE 8080
WORKDIR /app/backend
# Use the direct path to avoid tsconfig-paths issues
CMD ["node", "dist/main.js"]