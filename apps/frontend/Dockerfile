# apps/frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Build-time API URL (for production deploy)
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Build static files
COPY . .
RUN npm run build

# Install lightweight server to serve the build
RUN npm install -g serve

EXPOSE 5173

# Run production server
CMD ["serve", "-s", "dist", "-l", "5173"]