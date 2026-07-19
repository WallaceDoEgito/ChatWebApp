FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS dev
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "--configuration", "dev-docker"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist/chatapp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types 
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]