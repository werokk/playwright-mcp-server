# Use Node.js 20 with Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --production=false

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Install Playwright browsers (Chromium only for efficiency)
RUN npx playwright install chromium

# Set environment variables for headless operation
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Expose port (if needed for HTTP endpoint in future)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

