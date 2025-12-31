# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]

