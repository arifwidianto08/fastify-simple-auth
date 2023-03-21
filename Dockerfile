FROM node:14-alpine

WORKDIR /app

RUN apk add --no-cache --virtual python

COPY package.json package-lock.json ./

RUN yarn install

COPY . .

CMD yarn run dev
