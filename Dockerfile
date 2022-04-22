FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard ensures both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY ./src .

# Expose app port
EXPOSE 3001

CMD ["node", "index.js"]