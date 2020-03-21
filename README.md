# ecosia-treeminer

Node.js service that uses Puppeteer to mine some trees searching random words at Ecosia.org

![f](preview.png)

# Usage

### Environment

* `LOGS_PATH` -> Path where logs should be stored -> `/ecosia-treeminer/logs/`
* `PROXY` -> Option to make requests using a proxy -> `socks5://tor:9050`
* `MSTOWAIT` -> Milliseconds to wait for the next request -> `10000`

#### Docker

```
docker build -t majorcadevs/ecosia-treeminer -f docker/Dockerfile .
docker run --rm -p 8080:8080 -it majorcadevs/ecosia-treeminer
```

#### Docker Compose

```
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up
```

#### Local

```
npm install
npm start
```

