FROM node:alpine

WORKDIR /trans

# Copy package.json and package-lock.json
COPY package.json ./

# Install all dependencies including development dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port that the NextJS application listens on
EXPOSE 3000

# Start the NextJS application in watch mode for live reloading
CMD ["npm", "run", "dev"]