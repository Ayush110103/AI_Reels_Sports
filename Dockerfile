FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npx next build

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]