# Use the official Node.js 18 image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Expose port 8004
EXPOSE 8004

# Start the Node.js app
CMD [ "npm", "start" ]
