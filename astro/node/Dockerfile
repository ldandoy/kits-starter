FROM node:lts

WORKDIR /app

RUN apt-get update

EXPOSE 3000

COPY yarn.lock .

RUN npm install -g npm@latest

RUN yarn

COPY . .

CMD ["yarn", "dev"]