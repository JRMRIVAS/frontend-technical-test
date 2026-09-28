# Stage 1: build the Angular app
FROM node:22-alpine AS build

WORKDIR /app

# Copying the manifests first, so npm install is only re-run when they change
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve the static files with nginx.
# Node and node_modules stay behind, so the final image is small
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-frontend-test/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]