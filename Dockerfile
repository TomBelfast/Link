FROM node:18-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ git && \
    git config --global --add safe.directory /app

COPY package.json ./

# Dodaj konfigurację legacy-peer-deps
RUN \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set legacy-peer-deps true && \
    npm install --unsafe-perm --legacy-peer-deps

FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git && \
    git config --global --add safe.directory /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_RUNTIME=nodejs
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN apk add --no-cache \
    tzdata \
    curl \
    ca-certificates \
    bash

ENV TZ=Europe/Warsaw

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs && \
    mkdir -p /app/.next/cache /app/public/uploads && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app/public/uploads

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
