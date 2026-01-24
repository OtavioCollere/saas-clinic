# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fonte e arquivos de configuração
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Stage 3: Production Dependencies
FROM node:20-alpine AS production-deps

WORKDIR /app

# Copiar apenas package.json para instalar apenas dependências de produção
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Stage 4: Production
FROM node:20-alpine AS production

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copiar apenas arquivos necessários para produção
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/package.json ./package.json

# Mudar ownership para usuário não-root
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]

