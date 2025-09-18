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
EXPOSE 4000

# Default command: run dev server
CMD ["npm", "run", "dev"]
