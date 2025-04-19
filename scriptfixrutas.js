const fs = require('fs');
const path = require('path');

// Carpeta donde están tus archivos HTML (ajusta si es necesario)
const DOCS_DIR = path.join(__dirname, 'docs');

// Expresiones regulares para encontrar rutas relativas con ../
const regexList = [
    // CSS, JS, imágenes, favicon, etc.
    /((href|src)=["'])\.\.\/(css|js|images|assets|data)\/([^"']+)["']/gi,
    // Enlaces internos a otras páginas
    /href=["']\.\.\/([a-zA-Z0-9_\-]+\.html)["']/gi
];

// Función para arreglar rutas en un archivo HTML
function fixHtmlPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    regexList.forEach(regex => {
        content = content.replace(regex, (match, p1, p2, p3, p4) => {
            changed = true;
            // Para recursos (css, js, images, assets, data)
            if (p3 && p4) {
                return `${p1}${p3}/${p4}"`;
            }
            // Para enlaces internos
            if (!p3 && p4) {
                return `href="${p4}"`;
            }
            // Para enlaces internos (sin p3)
            if (!p3 && !p4 && p2) {
                return `${p1}`;
            }
            return match;
        });
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Rutas corregidas en: ${filePath}`);
    }
}

// Recorrer todos los archivos HTML en /docs
function processDocsDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDocsDir(fullPath);
        } else if (file.endsWith('.html')) {
            fixHtmlPaths(fullPath);
        }
    });
}

processDocsDir(DOCS_DIR);
console.log('¡Rutas corregidas en todos los HTML de /docs!');