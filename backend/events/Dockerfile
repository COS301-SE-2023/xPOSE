FROM node:16-alphine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY ./src ./src

CMD npm start
