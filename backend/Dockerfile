# Stage 1: Dependency Installation
# This stage installs all development and production dependencies.
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Stage 2: Builder
# This stage compiles the source code.
FROM dependencies AS builder
WORKDIR /app
COPY . .
# This command needs to match the build script in your package.json
RUN npm run build   

# Stage 3: Production
# This stage creates the final, minimal production image.
FROM node:22-alpine AS production
WORKDIR /app
# Copy only production dependencies from the first stage.
COPY --from=dependencies /app/node_modules ./node_modules
# Copy the compiled application from the builder stage.
COPY --from=builder /app/dist ./dist
# Copy the package.json to run the application.
COPY --from=builder /app/package.json .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]