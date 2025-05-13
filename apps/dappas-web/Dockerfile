# Base image  
FROM node:23.11.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN pnpm add -g turbo@^2
COPY . .

RUN ls -l

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN pnpm turbo prune dappas-web @workspace/ui --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile


# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/dappas-web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/dappas-web/.next/static ./apps/dappas-web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/dappas-web/public ./apps/dappas-web/public


EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the server
CMD ["node", "apps/dappas-web/server.js"]
