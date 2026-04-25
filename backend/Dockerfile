FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# --- Production ---
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pm2

COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY ecosystem.config.js .

# ✅ Copy the generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R node:node /app && chmod -R 755 /app

USER node

EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]