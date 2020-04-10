FROM node

# Copy files
COPY . /app
WORKDIR /app

# Install production packages
RUN npm install --production

ENTRYPOINT node .
