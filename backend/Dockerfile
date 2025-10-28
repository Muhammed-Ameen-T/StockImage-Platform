# Stage 1: Dependencies
# Installs only production dependencies to keep image small
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit

# Stage 2: Production
# Final lightweight image that runs your prebuilt app
FROM node:22-alpine AS production
WORKDIR /app

# Copy only the node_modules from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy prebuilt dist folder (already compiled locally)
COPY dist ./dist

# Copy environment file and package.json (optional but good practice)
COPY package.json ./
COPY .env ./

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]