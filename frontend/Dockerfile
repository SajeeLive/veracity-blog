# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration and locks
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/

# Install dependencies
# We don't need --ignore-scripts for the frontend as there's no Prisma
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend 
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# This runs "tsc -b && vite build" as defined in package.json
RUN pnpm --filter frontend build

# Stage 2: Production
FROM nginx:stable-alpine

# Copy the build output from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Create a custom nginx configuration to handle SPA routing and listen on 8080
RUN printf 'server {\n\
    listen 8080;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
