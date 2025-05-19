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
RUN pnpm turbo prune web @workspace/ui --docker

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

RUN ls -l /app/apps/web/dist


# Use a lightweight server to serve the static assets
FROM nginx:stable-alpine AS production


# Copy custom nginx config
COPY --from=installer /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from installer stage
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html


EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# Run the server
# Command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]
