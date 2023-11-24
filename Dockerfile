
# Use an official Node.js runtime as a parent image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies excluding development dependencies
RUN npm ci --only=production

# Copy the source code to the working directory
# COPY .ebextensions /var/proxy/staging/nginx/
# COPY .platform /var/proxy/staging/nginx/
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
# COPY --from=builder /app/.certificate /.certificate
# COPY --from=builder /app/.certificate /app/.certificate
# COPY --from=builder .platform .platform

# Expose the port the app runs on
EXPOSE 3000

ENV DB_HOST=shop-db.ck7ptdyer5qm.eu-north-1.rds.amazonaws.com
ENV DB_PORT=5432
ENV DB_DATABASE=cartdb
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=SECRET_PASSWORD

# Command to run the application
CMD ["node", "dist/main.js"]