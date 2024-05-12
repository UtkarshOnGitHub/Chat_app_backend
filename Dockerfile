# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /src/index.js

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
