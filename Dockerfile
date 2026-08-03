FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# ===== DEPENDÊNCIAS =====
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===== BUILD =====
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npx next build

# ===== RUNNER (produção) =====
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar arquivos necessários do build standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/local-data.json ./local-data.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
