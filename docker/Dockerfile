ARG ARCH=amd64
FROM ${ARCH}/node:lts-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /ecosia-treeminer
COPY package.json package-lock.json ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install && mkdir logs
COPY src/ /ecosia-treeminer/src/

ENV CHROMIUM_EXECUTABLE_PATH /usr/bin/chromium-browser
ENV LOGS_PATH /ecosia-treeminer/logs/

EXPOSE 8080

CMD ["node", "src/index.js"]
