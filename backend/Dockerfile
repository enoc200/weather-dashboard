FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY node_modules ./node_modules
COPY src ./src

ENV HOST=0.0.0.0

EXPOSE 4000
CMD ["npm", "start"]
