# Use official Node image
FROM node:20.11.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and lock first to enable Docker cache on npm install step
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Ensure the migrations directory always exists
RUN mkdir -p migrations

# Expose backend port (adjust if needed)
EXPOSE 5000

# Default command (production). For development, override using docker-compose.yml
CMD ["npm", "start"]