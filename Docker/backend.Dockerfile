# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files from root (since we're building from project root)
COPY package*.json ./

# Install dependencies (use npm install since package-lock may not exist)
RUN npm install --omit=dev

# Copy backend code
COPY backend/ ./backend/

# Set environment variables
ENV NODE_ENV=production

# Expose port (will be overridden by docker-compose)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/v1/health || exit 1

# Start the backend server
CMD ["node", "backend/server.js"]
