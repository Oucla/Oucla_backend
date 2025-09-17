ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm run build 
COPY . .
EXPOSE 6000    
CMD ["npm","run","start"]
