# ----------- DEV/PROD SWITCH ----------------
ARG NODE_ENV=production

FROM node:18 AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

# DEV stage: only run start, and mount code via docker-compose
FROM base AS dev
EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "start"]

# PROD stage: build + package w/nginx
FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]