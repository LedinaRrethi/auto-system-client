# Build React App
FROM node:18 AS build
WORKDIR /app
COPY .env.docker .env  # Copy docker env file as .env
COPY . .
RUN npm install
RUN npm run build

# Serve via nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
