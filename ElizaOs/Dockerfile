# Use Alpine for smaller footprint
FROM node:20-alpine AS builder

# Install pnpm and build dependencies
RUN npm install -g pnpm@9.15.1
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install with minimal memory usage
RUN NODE_OPTIONS="--max-old-space-size=512" \
    pnpm config set network-concurrency 1 && \
    pnpm config set child-concurrency 1 && \
    pnpm install --frozen-lockfile --no-optional --prefer-offline

# Copy source and build
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=768" pnpm build

# Production stage
FROM node:20-alpine

RUN npm install -g pnpm@9.15.1
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN NODE_OPTIONS="--max-old-space-size=256" \
    pnpm config set network-concurrency 1 && \
    pnpm install --prod --frozen-lockfile --no-optional

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/characters ./characters
COPY --from=builder /app/.env ./

# Create non-root user
RUN addgroup -g 1001 -S eliza && \
    adduser -S eliza -u 1001
USER eliza

EXPOSE $PORT

CMD ["sh", "-c", "NODE_OPTIONS='--max-old-space-size=512' pnpm start --non-interactive"]