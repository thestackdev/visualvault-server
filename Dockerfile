FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE $PORT
CMD [ "yarn", "start" ]
