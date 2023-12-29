# FROM nginx:1.19.0-alpine

# # COPY ../client/react-app/dist/ /usr/share/nginx/html

# COPY ./nginx-setup.conf /etc/nginx/conf.d/default.conf

# COPY ../client/react-app/dist/ /var/www/html/

# # Use an official Nginx image as a base image
# FROM nginx:1.19.0-alpine

# # Copy the Nginx configuration file
# COPY nginx-setup.conf /etc/nginx/conf.d/default.conf

# # Set the working directory to /var/www/html
# WORKDIR /var/www/html

# # Copy the built frontend files from the client/react-app/dist directory
# COPY ../client/react-app/dist/ .

# # Expose port 80
# EXPOSE 80

# # Start Nginx and keep it running
# CMD ["nginx", "-g", "daemon off;"]


# Stage 1: Build React app
FROM node:16-alpine AS builder
WORKDIR /app
COPY client/react-app/package*.json ./
RUN npm install
COPY ../client/react-app ./
RUN npm run build

# Stage 2: Nginx
FROM nginx:1.19.0-alpine
COPY nginx-setup.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /var/www/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


