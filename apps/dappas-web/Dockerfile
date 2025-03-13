# Base image
FROM node:23.7.0-alpine AS base

# Set the working directory to /app
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy only the `package.json` and `package-lock.json` files for the web app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder

# Set the working directory for building the app
WORKDIR /app

# Copy dependencies from the `deps` stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all files from the `apps/dappas-web` directory into `/app`
COPY . ./

# Build the specific app located in the monorepo
RUN npm run build:prod

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built output for the specific app
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the .env.local file to the container
COPY .env.local .env

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the server
CMD ["node", "server.js"]