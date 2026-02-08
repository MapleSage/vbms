FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (skip postinstall scripts for now)
RUN npm ci --omit=dev --ignore-scripts

# Copy application files
COPY .next ./.next
COPY public ./public
COPY next.config.js ./
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate --skip-engine-check || true

# Set port
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application  
CMD ["npm", "start"]
