# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variables for build
ARG VITE_API_BASE_URL=https://leafsnap-backend.onrender.com/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build Vite app
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
