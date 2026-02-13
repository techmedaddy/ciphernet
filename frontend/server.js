const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const apiUrl = process.env.API_URL || 'http://localhost:3001/api/v1';
const baseDirectory = path.join(__dirname, 'public');

const getContentType = (ext) => {
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

// Endpoint to get runtime config (API URL)
const handleConfigRequest = (req, res) => {
    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({ apiUrl }));
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Handle config endpoint
    if (req.url === '/config.json' || req.url === '/api/config') {
        return handleConfigRequest(req, res);
    }

    const safePath = path.normalize(req.url.split('?')[0]).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(baseDirectory, safePath);

    // Default to index.html for root or missing extension (SPA support)
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(baseDirectory, 'index.html');
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = getContentType(extname);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // For SPA routing, serve index.html for HTML requests
            if (!extname || extname === '.html') {
                filePath = path.join(baseDirectory, 'index.html');
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Page Not Found</h1>');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content);
                    }
                });
            } else {
                console.error(`File not found: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Not Found</h1>');
            }
        } else {
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    console.error(`Error reading file: ${filePath}`);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>500 - Internal Server Error</h1>');
                } else {
                    // Inject API_URL into JavaScript files
                    if (extname === '.js') {
                        let jsContent = content.toString();
                        // Replace placeholder or hardcoded localhost URLs
                        jsContent = jsContent.replace(
                            /const API_BASE_URL = ['"][^'"]+['"]/g,
                            `const API_BASE_URL = '${apiUrl}'`
                        );
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(jsContent);
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content);
                    }
                }
            });
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Frontend server running on http://0.0.0.0:${port}`);
    console.log(`📡 API URL configured as: ${apiUrl}`);
});
