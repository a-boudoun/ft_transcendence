FROM node:alpine

WORKDIR /trans

COPY . .

RUN npm install

EXPOSE 3000

# CMD ["npm", "run", "dev"]

RUN npm run build
CMD ["npm", "run", "start"]