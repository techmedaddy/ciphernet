const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const baseDirectory = path.join(__dirname, 'public');

const getContentType = (ext) => {
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon',
        '.png': 'image/png',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

const server = http.createServer((req, res) => {
    console.log(`Received request for: ${req.url}`);

    const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(baseDirectory, safePath);

    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(baseDirectory, 'index.html');
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = getContentType(extname);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1>');
        } else {
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    console.error(`Error reading file: ${filePath}`);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>500 - Internal Server Error</h1>');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Frontend server is running on http://localhost:${port}`);
});
