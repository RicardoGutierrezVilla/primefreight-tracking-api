FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY src ./src
COPY routes ./routes

# Cloud Run sets PORT; default to 8080 for local
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
