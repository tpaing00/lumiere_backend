FROM node:16

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /usr/src/app

COPY package*.json ./

# Set a build argument for the .env file path
ARG ENV_FILE
# Copy the .env file into the Docker image using the build argument
COPY $ENV_FILE ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]