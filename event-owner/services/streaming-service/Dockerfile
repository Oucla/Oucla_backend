# # Use the right Node version
# ARG NODE_VERSION=22.18.0
# FROM node:${NODE_VERSION}-alpine AS base

# # Set working directory
# WORKDIR /app

# # Install dependencies first
# COPY package*.json ./
# COPY tsconfig.json ./

# # Install dependencies including devDependencies
# # (needed for build tools like tsc)
# RUN npm install

# # Copy the rest of the source
# COPY . .
# RUN npx prisma generate --schema=src/prisma/schema.prisma
# # Run the build (TypeScript compile, Next.js build, etc.)
# RUN npm run build

# # Expose port
# EXPOSE 7070

# # Start the app (for example)
# CMD ["npm", "run", "start"]



# Use Node Alpine for smaller image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache python3 make g++

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose dev server port
EXPOSE 7070

# Default command: run dev server
CMD ["npm", "run", "dev"]


