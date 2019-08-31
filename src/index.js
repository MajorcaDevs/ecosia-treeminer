const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http'),
      rWord = require('random-words');
const WebSocket = require('ws');
const morgan = require('morgan');
const path = require('path')

const accessLogStream = fs.createWriteStream(path.join(process.env.LOGS_PATH || __dirname, 'access.log'), { flags: 'a' });
const accessLogger = morgan('combined', { stream: accessLogStream });

(async () => {

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    let status = null;
    let path = '';
    let imagenxd = Buffer.alloc(0)

    const httpServer = http.createServer((req, res) => {
        accessLogger(req, res, () => {
            //Save query string in a variable and remove it from the url
            const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?') + 1) : undefined
            if(query) {
                req.url = req.url.substring(0, req.url.indexOf('?'))
            }

            if(req.url === '/preview') {
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'no-cache',
                    'Content-Length': imagenxd.length,
                });
                res.end(imagenxd)
            } else if(req.url === '/status') {
                res.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream(__dirname + '/image.html').pipe(res);
            } else if(req.url === '/image.js') {
                res.writeHead(200, {'Content-Type': 'application/javascript'});
                fs.createReadStream(__dirname + '/image.js').pipe(res);
            } else if(req.url === '/') {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                });
                res.end(JSON.stringify({
                    proxy: process.env.PROXY,
                    status,
                    path,
                    currentPreview: `http://${req.headers.host || 'localhost:8080'}/status`,
                }, undefined, 2))
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('<h1>Not Found</h1>');
            }
        })
    }).listen(8080)

    const websucketServer = new WebSocket.Server({ path: '/ws', server: httpServer })

    const args = ['--no-sandbox', '--disable-setuid-sandbox']
    if(process.env.PROXY) {
        console.log(`Using Proxy => ${process.env.PROXY}`)
        args.push(`--proxy-server=${process.env.PROXY}`)
    }

    const browser = await puppeteer.launch({
        args,
        executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    });
    const page = await browser.newPage();
    const expires = ~~((+new Date / 1000) + 365*24*60*60)
    await page.setCookie({
        name: 'ECFG',
        value: `tt=na:dt=pc:f=n:tu=auto:fs=0:a=0:wu=auto:nt=0:lt=${expires}:l=en:nf=1:fr=0:ma=1:as=1:ps=0:cs=1:mc=en-gb`,
        path: '/',
        domain: '.ecosia.org',
        expires,
    })

    while (true) {
        const number = Math.floor(Math.random() * 4) + 1;
        const word = rWord({exactly: 1, wordsPerString: number});
        path = `https://www.ecosia.org/search?q=${word}`;
        const request = await page.goto(path);
        status = request.request().response().status();
        console.log(status, path)
        imagenxd = await page.screenshot({ encoding: 'binary' });
        websucketServer.clients.forEach(client => client.send('actualizao'))
        await wait(7500)
    }

})
().catch(e => {
    console.error(e);
    process.exit(1);
});
