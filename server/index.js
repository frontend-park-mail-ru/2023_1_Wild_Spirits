import { watchComponents } from './utils.js';
import http from 'http'
import fs from 'fs'
import debug from 'debug';

const log = debug('server')

const SERVER_PORT = 8002;

const page404 = "";

const templatePath = './public/templates'
const componentsPath = './public/compiled'

watchComponents(templatePath, componentsPath);

const server = http.createServer((request, response) => {
    log("REQUEST", request.method, request.url);
    const { url } = request;
    const normalizedUrl = url === "/" ? "/index.html" : url;

    log("normalized url ::", normalizedUrl);
    const filepath = `./public${normalizedUrl}`;
    log("filepath ::", filepath);

    const extension = normalizedUrl.split('.').at(-1)

    log(extension)

    if (extension == 'js') {
        log('set mime type js')
        response.setHeader('Content-Type', 'text/javascript');
    } else if (extension == 'svg') {
        log('set mime type image/svg+xml');
        response.setHeader('Content-Type', 'image/svg+xml');
    }

    fs.readFile(filepath, (err, data) => {
        if (err) {
            response.write(page404);
            response.end();
            log("error ::", err);
            return;
        }

        log("success");
        log(data);
        response.write(data);
        response.end();
    });
});

log("Starting server...");
server.listen(SERVER_PORT);
