# Docker/frontend.Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY ../frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY ../frontend .

# Expose the frontend port
EXPOSE 8080

# Start the frontend server
CMD ["node", "server.js"]
