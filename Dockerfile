FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy the current in the defined WORKDIR
COPY . .

EXPOSE 3000

CMD ["npm", "start"]