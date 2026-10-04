FROM oven/bun:1-alpine AS builder

WORKDIR /app

ARG EMDASH_ENCRYPTION_KEY
ARG EMDASH_SITE_URL

ENV EMDASH_ENCRYPTION_KEY=$EMDASH_ENCRYPTION_KEY
ENV EMDASH_SITE_URL=$EMDASH_SITE_URL

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build


FROM oven/bun:1-alpine

WORKDIR /app

ARG EMDASH_ENCRYPTION_KEY
ARG EMDASH_SITE_URL

ENV EMDASH_ENCRYPTION_KEY=$EMDASH_ENCRYPTION_KEY
ENV EMDASH_SITE_URL=$EMDASH_SITE_URL

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN mkdir -p data

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["bun", "./dist/server/entry.mjs"]
