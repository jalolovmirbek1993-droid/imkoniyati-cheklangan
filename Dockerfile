# 1-bosqich: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json bun.lock* ./
RUN npm ci

COPY . .
RUN npm run build

# 2-bosqich: Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
