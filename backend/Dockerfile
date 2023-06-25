# Use Node.js as the base image
FROM node:latest

workdir ./trans

# Copy package.json and package-lock.json
COPY package*.json .

# Install all dependencies including development dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port that the NestJS application listens on
EXPOSE 8000

# Start the NestJS application in watch mode for live reloading
CMD [ "npm", "run", "start:dev" ]