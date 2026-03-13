# apps/backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/ 
RUN npm install

# Build application
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

# Production launch
CMD ["npm", "run", "start:prod"]