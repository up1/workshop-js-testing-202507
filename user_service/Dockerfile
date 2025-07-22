FROM node:23
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test:api
RUN npm run swagger-autogen
CMD ["npm", "start"]