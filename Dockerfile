# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm ci

# Copiar todo o código e buildar
COPY . .
ENV NEXT_PRIVATE_TURBOPACK=0
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copiar app buildado
COPY --from=builder /app ./

# Expor porta padrão do Firebase Cloud Run
EXPOSE 8080

# Rodar app
CMD ["npm", "start"]
