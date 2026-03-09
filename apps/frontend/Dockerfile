# Use the official Node.js 22 Alpine image (lightweight)
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project source code
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Run in development mode with external access from the container
CMD ["npm", "run", "dev", "--", "--host"]
