# Use Node.js as the base image
FROM node:latest

# Copy package.json and package-lock.json


COPY package*.json ./

# Install all dependencies including development dependencies
RUN npm install && mkdir trans

COPY . ./trans

# Expose the port that the NestJS application listens on
EXPOSE 3000

# Start the NestJS application in watch mode for live reloading
CMD cd trans && npm run dev