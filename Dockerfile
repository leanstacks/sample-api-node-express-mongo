FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard ensures both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm clean-install

# Bundle app source
COPY ./dist .
COPY .env .

# Docker environment variables
ENV SERVER_PORT=3001

# Expose app port
EXPOSE ${SERVER_PORT}

CMD ["node", "index.js"]