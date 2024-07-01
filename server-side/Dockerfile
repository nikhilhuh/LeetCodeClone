# Use an official Node.js runtime as a parent image
FROM node:14

# Install C, C++, Java, and Python
RUN apt-get update && \
    apt-get install -y gcc g++ openjdk-11-jdk python3 python3-pip

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "server.js" ]
