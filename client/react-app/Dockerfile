
# Stage 1: Building the app
FROM node:alpine as build-stage

WORKDIR /app
COPY . .

# Install dependencies and build the static files
RUN npm install --prefix /app
RUN npm run build --prefix /app







# # pull official base image
# FROM node:lts-slim

# # set work directory
# WORKDIR /srv/app/

# # add to $PATH
# ENV PATH /srv/app/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install

# # add app
# COPY . ./

# # FINAL
# FROM nginx:stable-alpine
# RUN mkdir /srv/http
# ## add permissions 
# RUN chown -R nginx:nginx /srv/http && chmod -R 754 /srv/http 
# COPY --from=build /srv/app/build /srv/http
# # Allow custom nginx config for React Router etc
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# FROM node:alpine

# WORKDIR /app
# COPY . .

# RUN npm install

# CMD ["npm", "run", "build"]
# CMD ["npm", "run", "dev"]

# Set up Nginx to serve the built React app
# FROM nginx:alpine

# # Copy the build output from the previous stage
# # COPY --from=0 /app/build /var/www/frontend

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]


# Stage 2: Serve the app using Nginx
#FROM nginx:1.19.0-alpine



# Copy the built static files from the build stage
# COPY --from=build-stage app/dist /usr/share/nginx/html

# COPY . /app
# WORKDIR /app

# CMD ["mkdir", "dist"]

# COPY ./dist .

# FROM nginx:1.19.0-alpine
# COPY nginx-setup.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/dist /var/www/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


