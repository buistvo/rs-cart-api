# Use an official Node.js runtime as a parent image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies excluding development dependencies
RUN npm ci --only=production

# Copy the source code to the working directory
COPY . .

RUN npm install --global rimraf
RUN npm install --global @nestjs/cli

# Build the TypeScript code
RUN npm run build

# Use a smaller base image for the final image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]