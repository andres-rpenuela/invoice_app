# ---------------- BASE ----------------
FROM node AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# ---------------- DEVELOPMENT ----------------
FROM base AS dev
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]

# ---------------- BUILD ----------------
FROM base AS builder
ARG PROFILE=production
COPY .env .env
RUN npm run build -- --configuration=$PROFILE

# ---------------- TEST RUNTIME ----------------
FROM nginx:alpine AS runtime-test
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
COPY .env /usr/share/nginx/html/assets/config.env
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---------------- TEST RUNNER ----------------
FROM node:latest AS test-runner
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# Instalar Chromium y dependencias en Debian/Ubuntu
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

# Instalar Playwright si quieres tests headless
RUN npx playwright install

#RUN npm install -D @playwright/test
#RUN npx playwright install chromium

#CMD ["npm", "run", "test", "--", "--watch=false", "--browsers=ChromeHeadless"]
CMD ["npx", "ng", "test", "--watch=false", "--browsers=chromiumHeadless"]

# ---------------- PROD RUNTIME ----------------
FROM nginx:alpine AS runtime-prod
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
COPY .env /usr/share/nginx/html/assets/config.env
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
