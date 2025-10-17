# 1. Etapa de Instalação de Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Etapa de Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Desativa o Turbopack para garantir compatibilidade máxima
ENV NEXT_PRIVATE_TURBOPACK=0
RUN npm run build

# 3. Etapa de Produção/Execução
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Desativa o Turbopack em produção também
ENV NEXT_PRIVATE_TURBOPACK=0

# Copia os artefatos da build standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080
ENV PORT 8080

CMD ["node", "server.js"]
