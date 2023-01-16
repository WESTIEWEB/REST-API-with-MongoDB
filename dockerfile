FROM node:16-alpine

WORKDIR /app

COPY ["package.json", "yarn.lock",".env", "tsconfig.json","./"]

COPY . .

RUN yarn

RUN yarn tsc

EXPOSE 9200

CMD [ "yarn", "start" ]