// Servidor local simple para desarrollo
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = req.url;
    
    // Ruta por defecto
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Ruta completa al archivo
    filePath = path.join(__dirname, filePath);
    
    // Obtener la extensión del archivo
    const extname = path.extname(filePath);
    
    // Tipo de contenido por defecto
    let contentType = 'text/html';
    
    // Establecer el tipo de contenido según la extensión
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    // Leer el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Si no se encuentra la página, intentar buscar en tienda-web
                const fallbackPath = path.join(__dirname, 'tienda-web', req.url);
                fs.readFile(fallbackPath, (fallbackErr, fallbackContent) => {
                    if (fallbackErr) {
                        res.writeHead(404);
                        res.end('Archivo no encontrado');
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(fallbackContent, 'utf-8');
                    }
                });
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end(`Error del servidor: ${err.code}`);
            }
        } else {
            // Éxito
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/`);
    console.log('Para detener el servidor, presiona Ctrl+C');
});
