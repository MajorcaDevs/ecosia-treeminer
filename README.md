# ecosia-treeminer

Node.js service that uses Puppeteer to mine some trees searching random words at Ecosia.org

![f](preview.png)

# Usage

### Environment

* `LOGS_PATH` -> Path where logs should be stored -> `/ecosia-treeminer/logs/`
* `PROXY` -> Option to make requests using a proxy -> `socks5://tor:9050`

#### Docker

```
docker build -t majorcadevs/ecosia-treeminer .
docker run --rm -p 8080:8080 -it majorcadevs/ecosia-treeminer
```

#### Docker Compose

```
docker-compose build
docker-compose up
```

#### Local

```
npm install
node src/index.js
```

