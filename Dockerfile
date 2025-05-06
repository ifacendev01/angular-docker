

FROM node:latest as build

WORKDIR /angular-docker

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --configuration=production

FROM nginx:latest

COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

COPY --from=build /angular-docker/dist/angular-docker/browser /usr/share/nginx/html

EXPOSE 80
