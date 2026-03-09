# Use the official Node.js 22 Alpine image (very lightweight)
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project code
COPY . .

# Build the project (compile TypeScript to JavaScript)
RUN npm run build

# Expose port 4000 (as configured in main.ts)
EXPOSE 4000

# Command to start the application
CMD ["npm", "run", "start:prod"]
