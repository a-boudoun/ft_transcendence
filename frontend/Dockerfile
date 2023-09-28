FROM node:alpine

WORKDIR /trans

# Copy the entire project to the container
COPY . .

# Install all dependencies including development dependencies
RUN npm install

EXPOSE 3000

# CMD ["npm", "run", "dev"]

RUN npm run build
CMD ["npm", "run", "start"]