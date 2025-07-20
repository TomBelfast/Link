FROM node:18-alpine AS deps

WORKDIR /app

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache libc6-compat python3 make g++ git && \
    git config --global --add safe.directory /app

COPY package.json package-lock.json ./

# Dodaj konfigurację legacy-peer-deps
RUN \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set legacy-peer-deps true && \
    if [ -f package-lock.json ]; then \
        npm ci --unsafe-perm --network-timeout 300000 --legacy-peer-deps; \
    else \
        npm install --unsafe-perm --network-timeout 300000 --legacy-peer-deps; \
    fi

FROM node:18-alpine AS builder

WORKDIR /app

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache git && \
    git config --global --add safe.directory /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_RUNTIME=nodejs
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV NEXT_DISABLE_OPTIMIZATION=1
ENV SKIP_TYPE_CHECK=1
ENV NIXPACKS_PATH=/usr/local/bin

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN apk add --no-cache \
    tzdata \
    curl \
    ca-certificates \
    bash \
    sqlite \
    mysql-client \
    netcat-openbsd

ENV TZ=Europe/Warsaw

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./

RUN npm install --production --legacy-peer-deps

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
ENV NEXT_RUNTIME=nodejs

EXPOSE 3000

CMD ["node", "server.js"]

FROM node:18-alpine AS dev

WORKDIR /app

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git \
    tzdata \
    curl \
    ca-certificates \
    bash \
    sqlite \
    mysql-client \
    netcat-openbsd && \
    git config --global --add safe.directory /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set legacy-peer-deps true && \
    npm install --legacy-peer-deps

COPY . .

ENV TZ=Europe/Warsaw
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_RUNTIME=nodejs
ENV NODE_OPTIONS="--max_old_space_size=4096"

EXPOSE 3000

CMD ["npm", "run", "dev"]
