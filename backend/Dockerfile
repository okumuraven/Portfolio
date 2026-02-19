FROM node:18

WORKDIR /app

COPY package*.json ./
# For Docker Compose dev, install ALL dependencies (including devDependencies)
RUN npm install

COPY . .

# Do NOT set NODE_ENV=production! This avoids skipping devDependencies like node-pg-migrate for local/dev!
# ENV NODE_ENV=production

EXPOSE 5000

# The actual command to run (handled by docker-compose.yml, not here)
CMD [ "npm", "start" ]