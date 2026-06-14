FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY node_modules ./node_modules
COPY index.html vite.config.js ./
COPY src ./src

EXPOSE 5173
CMD ["npm", "run", "dev"]
