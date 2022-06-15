FROM node:16

RUN apt-get update && apt-get install -y gettext-base

WORKDIR /app
COPY ./package.json package.json
RUN npm install
RUN npm install -g ts-node
COPY . .

CMD ["npm", "run", "start:frontend"]