FROM node:23 AS build
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /api/dist /usr/share/nginx/html
EXPOSE 80