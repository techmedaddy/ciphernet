const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';  // Serve index.html for root requests

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        // Add any other necessary MIME types
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, serve 404 page
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 - Page Not Found', 'utf-8');
            } else {
                // Handle server error
                res.writeHead(500);
                res.end(`Server error: ${error.code}`, 'utf-8');
            }
        } else {
            // Serve the requested file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
