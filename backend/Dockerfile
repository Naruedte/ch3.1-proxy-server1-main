# Stage 1: Build
FROM node:20-alpine AS builder

# Install build dependencies for Prisma
RUN apk add --no-cache openssl

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Generate Prisma Client (ignore connection error during build)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies for Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Create logs directory
RUN mkdir -p /app/logs && chown -R node:node /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]
