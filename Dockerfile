FROM node:22.18.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm rebuild esbuild

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
