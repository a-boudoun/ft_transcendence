# Use Node.js as the base image
FROM node:alpine

WORKDIR /trans

COPY . .

RUN npm install

# Start the NestJS application in watch mode for live reloading
CMD [ "npm", "run", "start:dev"]

# RUN npm run build
# CMD [ "npm", "run", "start" ]