# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the backend and frontend
COPY ../backend/package*.json ./backend/
COPY ../frontend/package*.json ./frontend/

# Install backend dependencies
RUN npm install --prefix ./backend

# Install frontend dependencies
RUN npm install --prefix ./frontend

# Copy the rest of your application code
COPY ../backend ./backend
COPY ../frontend ./frontend

# Expose the ports your app runs on
EXPOSE 3001 8080

# Start the backend and frontend in parallel
CMD ["sh", "-c", "node backend/server.js & node frontend/server.js"]
