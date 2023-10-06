# Use Node.js as the base image
FROM node:alpine
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8000

# Start the NestJS application in watch mode for live reloading
CMD [ "npm", "run", "start:dev" ]

# RUN npm run build
# CMD [ "npm", "run", "start" ]