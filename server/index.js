const http = require("http");
const fs = require("fs");
const debug = require("debug");

const log = debug("server");

const SERVER_PORT = 8002;

const page404 = "";

const server = http.createServer((request, response) => {
    log("REQUEST", request.method, request.url);
    const { url } = request;
    const normalizedUrl = url === "/" ? "/index.html" : url;

    log("normalized url ::", normalizedUrl);
    const filepath = `./public${normalizedUrl}`;
    log("filepath ::", filepath);

    log(normalizedUrl.split(".").at(-1));
    if (normalizedUrl.split(".").at(-1) == "js") {
        log("set mime type js");
        response.setHeader("Content-Type", "text/javascript");
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
