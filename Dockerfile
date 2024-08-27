FROM node:20

# get app version from build-arg and set to APP_VERSION env
ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG

# Create working directory in container
RUN mkdir -p /usr/src/server

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy configuration files and dependencies 
COPY ./server/package*.json ./

# Install dependencies 
RUN npm install

# Copy the application code 
COPY ./server/src/ ./src/

RUN echo > /usr/src/server/database.sqlite

# Expose the port 
EXPOSE 3000

# Command to launch the application 
CMD ["npm", "start"]
