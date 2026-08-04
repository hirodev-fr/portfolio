# --- step 1 : buid ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apk add --no-cache python3 make g++

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm run build

RUN pnpm deploy --filter=portfolio --prod --legacy /pruned

# --- step 2 : final image ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=builder /pruned/package.json ./
COPY --from=builder /pruned/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN rm -rf node_modules/better-sqlite3/build/Release/obj || true
RUN rm -rf node_modules/better-sqlite3/deps || true

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]