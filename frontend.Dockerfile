# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY ./nexus-light-app/package.json ./nexus-light-app/package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY ./nexus-light-app/ .

# Build the application
RUN npx vite build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# The nginx.conf file will be copied via docker-compose
# EXPOSE 80 (default for nginx)
CMD ["nginx", "-g", "daemon off;"]
