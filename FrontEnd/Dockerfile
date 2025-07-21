FROM node:22-alpine AS build
EXPOSE 4200
WORKDIR /app
COPY package.json package-lock.json ./
#RUN npm install -g @angular/cli
RUN npm install
COPY . .
#ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0"]
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/chatapp/browser usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
