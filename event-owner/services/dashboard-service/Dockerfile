ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install 
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build 
EXPOSE 6000    
CMD ["npm","run","start"]
