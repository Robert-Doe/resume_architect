# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4173

COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/scripts   ./scripts
COPY --from=builder /app/package.json ./

EXPOSE 4173

CMD ["node", "scripts/serve-dist.mjs"]
