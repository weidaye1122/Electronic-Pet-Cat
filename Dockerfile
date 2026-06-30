FROM node:22-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4173
ENV PET_DATA_FILE=/data/pet-state.json
ENV STATIC_DIR=/app/dist

COPY --from=build /app/dist ./dist
COPY server ./server

VOLUME ["/data"]
EXPOSE 4173

CMD ["node", "server/index.mjs"]
