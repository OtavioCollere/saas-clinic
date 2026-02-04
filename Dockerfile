############################
# Base
############################
FROM node:20.18-alpine AS base

ENV NODE_ENV=production

RUN npm install -g pnpm

############################
# Dependencies
############################
FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# instala TODAS deps (newrelic incluso)
RUN pnpm install --frozen-lockfile

############################
# Build
############################
FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Prisma client
RUN pnpm prisma generate

# Build Nest
RUN pnpm build

# Remove dev deps (mantém newrelic)
RUN pnpm prune --prod

############################
# Runtime (Deploy)
############################
FROM node:20.18-alpine AS deploy

ENV NODE_ENV=production

WORKDIR /usr/src/app

# usuário não-root (ECS best practice)
# A imagem node:20.18-alpine já vem com o usuário 'node', vamos usar ele

# Copia apenas o necessário
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/newrelic.js ./newrelic.js

USER node

EXPOSE 3000

# New Relic SEMPRE no preload
CMD ["/usr/local/bin/node", "-r", "newrelic", "dist/src/main.js"]
