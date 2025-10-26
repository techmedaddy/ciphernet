# Use an official Node.js image as the base
FROM node:14

# Set the working directory
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json
COPY ../backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend code
COPY ../backend .

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
