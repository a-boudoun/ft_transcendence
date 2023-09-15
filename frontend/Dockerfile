FROM node:alpine

WORKDIR /trans

# Copy the entire project to the container
COPY . .

# Install all dependencies including development dependencies
RUN npm install

# Expose the port that the NextJS application listens on
EXPOSE 3000

# Start the NextJS application in watch mode for live reloading
CMD ["npm", "run", "dev"]