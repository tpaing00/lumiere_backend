FROM node:16

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /usr/src/app

COPY . .

RUN npm cache clean --force &&  npm install

EXPOSE 8080

CMD [ "node", "app.js" ]