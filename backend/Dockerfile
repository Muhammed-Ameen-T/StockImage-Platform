# Stage 1: Base
FROM node:22-alpine AS base
WORKDIR /app

# Copy package.json files from the backend subdirectory
COPY backend/package*.json ./
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
RUN npm install
COPY backend .

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Builder
FROM base AS builder
RUN npm run build

# Stage 4: Production
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]