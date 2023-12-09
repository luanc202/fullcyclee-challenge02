FROM node:20-slim
RUN npm install -g pnpm

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]