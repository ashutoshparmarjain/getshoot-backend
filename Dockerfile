FROM node:20-bullseye


# Install OpenSSL 1.1
RUN apt-get update -y && \
    apt-get install -y openssl libssl1.1 && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/server.js"]