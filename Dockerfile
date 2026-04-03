FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 appgrp && adduser --system --uid 1001 appuser

ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0

# Copy built assets and production deps
COPY --from=builder --chown=appuser:appgrp /app/dist ./dist
COPY --from=deps --chown=appuser:appgrp /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgrp /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgrp /app/drizzle ./drizzle

# Entrypoint script for migrations
COPY --chown=appuser:appgrp scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/').then(r=>{process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
