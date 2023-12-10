FROM node:20-slim AS builder
RUN apt-get update -y && apt-get install -y libssl-dev
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev
COPY . .
RUN npm install prisma
RUN npx --yes prisma generate
RUN npm install @nestjs/cli
RUN npm run build

FROM node:20-slim
RUN apt-get update -y && apt-get install -y libssl-dev
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/.env ./
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules

USER node
CMD [ "npm", "run", "start:prod" ]