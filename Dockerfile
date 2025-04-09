# Build stage for React client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build stage for Node.js server
FROM node:18-alpine AS server-build
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Production stage
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy server files and client build
COPY --from=server-build /app ./
COPY --from=client-build /app/client/build ./client/build

# Install production dependencies only
RUN npm ci --omit=dev

# Create user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs
USER nodeuser

# Expose port and start application
EXPOSE 6000
CMD ["node", "server.js"]
