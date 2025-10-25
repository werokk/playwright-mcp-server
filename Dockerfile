# Use Node.js 20 with Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies with memory optimization
RUN npm install --production=false --no-audit --no-fund

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Install only Chromium (not all browsers) to save memory
RUN npx playwright install chromium --with-deps

# Set environment variables for headless operation and memory optimization
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_OPTIONS="--max-old-space-size=512"

# Expose port
EXPOSE 3000

# Start the server with memory limits
CMD ["node", "--max-old-space-size=512", "dist/index.js"]

