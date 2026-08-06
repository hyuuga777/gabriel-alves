FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl


# ===== DEPENDÊNCIAS =====
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ===== BUILD =====
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Gerar Prisma Client
RUN npx prisma generate
# Build Next.js (standalone)
RUN npm run build

# ===== RUNNER (produção) =====
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar dependências e build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/local-data.json ./local-data.json

# Copiar schema Prisma e client gerado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Iniciar o servidor Next.js standalone em produção
CMD node server.js
