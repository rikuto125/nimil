# Base Layer
FROM node:14-slim AS base
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .

# Build Layer
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build

COPY --from=base /app ./
RUN yarn build

# Package install Layer
FROM node:14-slim AS package

WORKDIR /modules

COPY package.json yarn.lock ./
RUN yarn install --non-interactive --frozen-lockfile --production

# Production Run Layer
FROM node:14-slim as run
ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=build /build/public ./public
COPY --from=build /build/.next ./.next
COPY --from=package /modules/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
