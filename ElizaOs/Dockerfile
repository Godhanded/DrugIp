# Use a specific Node.js version for better reproducibility
FROM node:23.3.0-slim AS builder

# Install pnpm globally and install necessary build tools
RUN npm install -g pnpm@9.15.1 
RUN apt-get update && \
    apt-get install -y git python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory
WORKDIR /app

# Copy package.json and other configuration files first for better caching
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Install dependencies first (this layer will be cached if package.json doesn't change)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY ./src ./src
# COPY ./characters ./characters
# COPY ./.env ./

# Build the project with memory optimization and disable source maps for production
RUN NODE_OPTIONS="--max-old-space-size=1536" pnpm build

# Production stage
FROM node:23.3.0-slim

# Install only runtime dependencies
RUN npm install -g pnpm@9.15.1
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install 

# Copy built application and necessary files
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/characters ./characters
# COPY --from=builder /app/.env ./
COPY --from=builder /app/tsconfig.json ./

# Create a non-root user for security
# RUN addgroup --system --gid 1001 eliza && \
#     adduser --system --uid 1001 eliza
# USER eliza

# Render uses the PORT environment variable
EXPOSE $PORT

# Set Node.js memory limit and run the application
CMD ["NODE_OPTIONS='--max-old-space-size=768' pnpm start --non-interactive"]





# # Use a specific Node.js version for better reproducibility
# FROM node:23.3.0-slim AS builder

# # Install pnpm globally and install necessary build tools
# RUN npm install -g pnpm@9.15.1 
# RUN apt-get update && \
#     apt-get install -y git python3 make g++ && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # Set Python 3 as the default python
# RUN ln -s /usr/bin/python3 /usr/bin/python

# # Set the working directory
# WORKDIR /app

# # Copy package.json and other configuration files
# COPY package.json ./
# COPY pnpm-lock.yaml ./
# COPY tsconfig.json ./

# # Copy the rest of the application code
# COPY ./src ./src
# # COPY ./characters ./characters
# # COPY ./.env ./

# # Install dependencies and build the project
# RUN pnpm i
# RUN pnpm build 
# # Create a new stage for the final image
# FROM node:23.3.0-slim

# # Install runtime dependencies if needed
# RUN npm install -g pnpm@9.15.1
# RUN apt-get update && \
#     apt-get install -y git python3 && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Copy built artifacts and production dependencies from the builder stage
# COPY --from=builder /app/package.json /app/
# COPY --from=builder /app/node_modules /app/node_modules
# COPY --from=builder /app/src /app/src
# # COPY --from=builder /app/characters /app/characters
# # COPY --from=builder /app/.env /app/
# COPY --from=builder /app/dist /app/dist
# COPY --from=builder /app/tsconfig.json /app/
# COPY --from=builder /app/pnpm-lock.yaml /app/

# EXPOSE 10000
# # Set the command to run the application
# CMD ["pnpm", "start", "--non-interactive"]
# # CMD ["node", "dist/index.js"]