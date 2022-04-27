FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard ensures both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY ./src .
COPY .env .

# Docker build arguments
ARG SERVER_PORT=3001

# Expose app port
EXPOSE ${SERVER_PORT}

CMD ["node", "index.js"]