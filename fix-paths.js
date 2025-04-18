const fs = require('fs');
const path = require('path');

// Primero corregir archivos en la raíz para GitHub Pages
const files = [
    'checkout.html',
    'failure.html',
    'success.html',
    'confirm-payment.html',
    'cart.html',
    'product.html',
    'bank-transfer-instructions.html'
];

// Añadir CSS específico necesario para el procesamiento de overlay
const processingCSS = `
/* Estilos para overlay de procesamiento */
#processing-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.processing-content {
    background-color: white;
    padding: 40px;
    border-radius: var(--radius-md);
    text-align: center;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(var(--primary-color-rgb), 0.3);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-container {
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease;
}

.error-message-box {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: rgba(var(--error-color), 0.1);
    border-left: 4px solid var(--error-color);
    border-radius: var(--radius-sm);
    color: var(--error-color);
    position: relative;
}

.error-message-box i {
    margin-right: 10px;
    font-size: 1.2em;
}

.close-error {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--error-color);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.close-error:hover {
    opacity: 1;
}
`;

// Añadir script para cerrar mensaje de error
const errorCloseScript = `
// Script para cerrar mensajes de error
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.close-error');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const errorContainer = this.closest('.error-container');
            if (errorContainer) {
                errorContainer.style.display = 'none';
            }
        });
    });
});
`;

// Procesar cada archivo en la raíz
files.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Corregir rutas CSS, JS e imágenes para archivos en la raíz
        content = content.replace(/href="\.\.\/css\//g, 'href="tienda-web/css/');
        content = content.replace(/href="\.\.\/images\//g, 'href="tienda-web/images/');
        content = content.replace(/src="\.\.\/js\//g, 'src="tienda-web/js/');
        content = content.replace(/src="\.\.\/images\//g, 'src="tienda-web/images/');
        content = content.replace(/src="\.\.\/assets\//g, 'src="tienda-web/assets/');
        
        // Corregir enlaces a páginas
        content = content.replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
        
        // Corregir duplicados de script paykassa.js
        content = content.replace(/<script src="tienda-web\/js\/paykassa\.js"><\/script>\s*<script src="tienda-web\/js\/paykassa\.js"><\/script>/g, '<script src="tienda-web/js/paykassa.js"></script>');
        
        // Corregir enlaces entre páginas
        content = content.replace(/href="([^\.\/].*?)\.html"/g, 'href="$1.html"');
        
        // Corregir enlaces a checkout.html en páginas/carpetas
        content = content.replace(/href="pages\/checkout\.html"/g, 'href="checkout.html"');
        content = content.replace(/href="checkout\.html"/g, 'href="checkout.html"');
        // Para enlaces desde las páginas dentro de tienda-web/pages/
        content = content.replace(/href="\.\.\/pages\/checkout\.html"/g, 'href="../checkout.html"');
        
        // Asegurarse de tener CSS para el overlay de procesamiento
        if (file === 'checkout.html' && content.includes('processing-overlay')) {
            const cssLink = '<link rel="stylesheet" href="tienda-web/css/checkout.css">';
            if (!content.includes(cssLink) && !content.includes('id="processing-overlay-styles"')) {
                const headEnd = content.indexOf('</head>');
                if (headEnd !== -1) {
                    const styleTag = `\n    <!-- Estilos de overlay de procesamiento -->\n    <style id="processing-overlay-styles">${processingCSS}</style>\n`;
                    content = content.substring(0, headEnd) + styleTag + content.substring(headEnd);
                }
            }
        }
        
        // Asegurarse de que todos los archivos tienen la estructura completa HTML5
        if (!content.includes('<!DOCTYPE html>')) {
            content = `<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${file.charAt(0).toUpperCase() + file.slice(1, -5)} | LuxMarket</title>\n    <link rel="stylesheet" href="tienda-web/css/style.css">\n</head>\n<body>\n` + content + `\n</body>\n</html>`;
        }
        
        // Añadir script para cerrar mensajes de error si existe un elemento .error-container
        if (content.includes('error-container') && !content.includes('close-error')) {
            const bodyEnd = content.lastIndexOf('</body>');
            if (bodyEnd !== -1) {
                const script = `\n    <script>\n    ${errorCloseScript}\n    </script>\n`;
                content = content.substring(0, bodyEnd) + script + content.substring(bodyEnd);
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Corregido: ${file}`);
    } else {
        console.log(`✗ No encontrado: ${file}`);
    }
});

// Corregir el checkout.html en la carpeta tienda-web/pages
const checkoutPath = path.join(__dirname, 'tienda-web/pages/checkout.html');

if (fs.existsSync(checkoutPath)) {
    let content = fs.readFileSync(checkoutPath, 'utf8');
    
    // Corregir rutas CSS, JS e imágenes - de formato tienda-web/... a ../...
    content = content.replace(/href="tienda-web\/css\//g, 'href="../css/');
    content = content.replace(/href="tienda-web\/images\//g, 'href="../images/');
    content = content.replace(/src="tienda-web\/js\//g, 'src="../js/');
    content = content.replace(/src="tienda-web\/images\//g, 'src="../images/');
    content = content.replace(/src="tienda-web\/assets\//g, 'src="../assets/');
    
    // Corregir enlaces a páginas
    content = content.replace(/href="index\.html"/g, 'href="../index.html"');
    
    // Eliminar scripts duplicados
    content = content.replace(/<script src="\.\.\/js\/paykassa\.js"><\/script>\s*<script src="\.\.\/js\/paykassa\.js"><\/script>/g, '<script src="../js/paykassa.js"></script>');
    
    // Asegurarse de que tenga el overlay de procesamiento
    if (!content.includes('processing-overlay')) {
        const bodyEndPos = content.lastIndexOf('</body>');
        if (bodyEndPos !== -1) {
            const processingOverlay = `
    <!-- Overlay de procesamiento -->
    <div id="processing-overlay" style="display: none;">
        <div class="processing-content">
            <div class="spinner"></div>
            <h3>Procesando tu pago</h3>
            <p>Por favor espera mientras conectamos con Paykassa...</p>
        </div>
    </div>
`;
            content = content.substring(0, bodyEndPos) + processingOverlay + content.substring(bodyEndPos);
        }
    }
    
    // Asegurarse de que tenga el contenedor de errores
    if (!content.includes('form-errors')) {
        const formStartPos = content.indexOf('<form');
        if (formStartPos !== -1) {
            const errorContainer = `
    <!-- Contenedor de errores -->
    <div id="form-errors" style="display: none;" class="error-container">
        <div class="error-message-box">
            <i class="fas fa-exclamation-circle"></i>
            <span id="error-message">Ha ocurrido un error</span>
            <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
    </div>
`;
            const formEndTagPos = content.indexOf('>', formStartPos) + 1;
            content = content.substring(0, formEndTagPos) + errorContainer + content.substring(formEndTagPos);
        }
    }
    
    // Añadir script para cerrar los mensajes de error
    if (content.includes('error-container') && !content.includes('close-error')) {
        const bodyEnd = content.lastIndexOf('</body>');
        if (bodyEnd !== -1) {
            const script = `
    <script>
    ${errorCloseScript}
    </script>
`;
            content = content.substring(0, bodyEnd) + script + content.substring(bodyEnd);
        }
    }
    
    // Verificar si PaykassaIntegration está iniciado correctamente
    if (content.includes('paykassa.js') && !content.includes('TU_SHOP_ID')) {
        // Añadir inicialización para desarrollo
        const bodyEnd = content.lastIndexOf('</body>');
        if (bodyEnd !== -1) {
            const initScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Inicialización para pruebas locales de Paykassa
            const paykassa = new PaykassaIntegration('64135', 'sandbox_api_key', true);
            paykassa.init();
        });
    </script>
`;
            // Solo añadir si no hay un script de inicialización de Paykassa
            if (!content.includes('PaykassaIntegration(')) {
                content = content.substring(0, bodyEnd) + initScript + content.substring(bodyEnd);
            }
        }
    }
    
    fs.writeFileSync(checkoutPath, content, 'utf8');
    console.log(`✓ Corregido: checkout.html en tienda-web/pages/`);
} else {
    console.log(`✗ No encontrado: checkout.html en tienda-web/pages/`);
}

// Corregir success.html si existe en tienda-web/pages
const successPath = path.join(__dirname, 'tienda-web/pages/success.html');

if (fs.existsSync(successPath)) {
    let content = fs.readFileSync(successPath, 'utf8');
    
    // Corregir rutas
    content = content.replace(/href="tienda-web\/css\//g, 'href="../css/');
    content = content.replace(/href="tienda-web\/images\//g, 'href="../images/');
    content = content.replace(/src="tienda-web\/js\//g, 'src="../js/');
    content = content.replace(/src="tienda-web\/images\//g, 'src="../images/');
    content = content.replace(/src="tienda-web\/assets\//g, 'src="../assets/');
    content = content.replace(/href="index\.html"/g, 'href="../index.html"');
    
    // Asegurarse de que tenga la estructura básica completa
    if (!content.includes('<body')) {
        content = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pago Exitoso | LuxMarket</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/responsive.css">
    <link rel="stylesheet" href="../css/checkout.css">
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="../images/15.png">
</head>
<body class="success-page">
    <header>
        <div class="container">
            <a href="../index.html" class="logo">
                <i class="fas fa-shopping-bag"></i>
                <span>LuxMarket</span>
            </a>
            <nav>
                <ul>
                    <li><a href="../index.html"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="product.html"><i class="fas fa-store"></i> Productos</a></li>
                    <li><a href="cart.html"><i class="fas fa-shopping-cart"></i> Carrito</a></li>
                    <li><a href="contact.html"><i class="fas fa-envelope"></i> Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <div class="container">
            <div class="success-container">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1>¡Pago Completado con Éxito!</h1>
                <p class="success-message">Gracias por tu compra. Hemos recibido tu pago correctamente.</p>
                
                <div class="order-info">
                    <h2>Detalles del Pedido</h2>
                    <div class="order-details">
                        <div class="detail-row">
                            <span>Número de pedido:</span>
                            <span id="order-id">ORD-12345</span>
                        </div>
                        <div class="detail-row">
                            <span>Fecha:</span>
                            <span id="order-date">18/04/2025</span>
                        </div>
                        <div class="detail-row">
                            <span>Total pagado:</span>
                            <span id="order-total">€339.98</span>
                        </div>
                        <div class="detail-row">
                            <span>Método de pago:</span>
                            <span id="payment-method">Paykassa (Bitcoin)</span>
                        </div>
                    </div>
                </div>
                
                <p>Te hemos enviado un correo electrónico con los detalles de tu compra.</p>
                
                <div class="success-actions">
                    <a href="../index.html" class="btn btn-primary">Seguir comprando</a>
                    <a href="orders.html" class="btn btn-secondary">Ver mis pedidos</a>
                </div>
            </div>
        </div>
    </main>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Recuperar datos del pedido del localStorage
            const orderData = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
            
            // Mostrar detalles del pedido
            if (orderData.order_id) {
                document.getElementById('order-id').textContent = orderData.order_id;
                document.getElementById('order-total').textContent = \`€\${orderData.amount.toFixed(2)}\`;
                document.getElementById('payment-method').textContent = \`Paykassa (\${orderData.crypto})\`;
                
                // Fecha actual formateada
                const date = new Date();
                document.getElementById('order-date').textContent = date.toLocaleDateString();
                
                // Limpiar el carrito y el pedido pendiente
                localStorage.removeItem('cartItems');
                localStorage.removeItem('pendingOrder');
            }
        });
    </script>
</body>
</html>`;
    }
    
    fs.writeFileSync(successPath, content, 'utf8');
    console.log(`✓ Corregido/creado: success.html en tienda-web/pages/`);
    
    // Copiar a la raíz si no existe
    const rootSuccessPath = path.join(__dirname, 'success.html');
    if (!fs.existsSync(rootSuccessPath)) {
        let rootContent = content;
        rootContent = rootContent.replace(/href="\.\.\/css\//g, 'href="tienda-web/css/');
        rootContent = rootContent.replace(/href="\.\.\/images\//g, 'href="tienda-web/images/');
        rootContent = rootContent.replace(/src="\.\.\/js\//g, 'src="tienda-web/js/');
        rootContent = rootContent.replace(/src="\.\.\/images\//g, 'src="tienda-web/images/');
        rootContent = rootContent.replace(/src="\.\.\/assets\//g, 'src="tienda-web/assets/');
        rootContent = rootContent.replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
        
        fs.writeFileSync(rootSuccessPath, rootContent, 'utf8');
        console.log(`✓ Creado: success.html en la raíz`);
    }
} else {
    console.log(`✗ No encontrado: success.html en tienda-web/pages/`);
}

// Corregir archivo paykassa.js para usar credenciales de prueba
const paykassaPath = path.join(__dirname, 'tienda-web/js/paykassa.js');
if (fs.existsSync(paykassaPath)) {
    let content = fs.readFileSync(paykassaPath, 'utf8');
    
    // Reemplazar la sección de inicialización con credenciales genéricas de prueba
    content = content.replace(
        /document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]+?const paykassa = new PaykassaIntegration\(['"](.*?)['"],\s*['"](.*?)['"],\s*(true|false)\);/g, 
        `document.addEventListener('DOMContentLoaded', () => {
    // Credenciales de prueba para desarrollo local
    const paykassa = new PaykassaIntegration('64135', 'sandbox_api_key', true);`
    );
    
    // Asegurarse de que la función simulatePaykassaApiCall incluye rutas relativas
    if (content.includes('simulatePaykassaApiCall') && !content.includes('window.location.origin')) {
        content = content.replace(
            /async simulatePaykassaApiCall\(transactionData\) \{[\s\S]+?return \{[\s\S]+?url: [`'"]([^`'"]+)[`'"][\s\S]+?\};/g,
            `async simulatePaykassaApiCall(transactionData) {
        // Simulación: en producción, esta llamada se haría desde el backend
        console.log('Enviando datos a Paykassa:', transactionData);
        
        // Simular un tiempo de espera para la API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Para pruebas locales, usar URLs relativas al origen actual
        const baseUrl = window.location.origin;
        
        // Determinar la URL de redirección según la criptomoneda seleccionada
        let redirectUrl;
        if (transactionData.payment_system === 'BTC') {
            redirectUrl = \`\${baseUrl}/success.html?transaction_id=\${transactionData.order_id}\`;
        } else if (transactionData.payment_system === 'ETH') {
            redirectUrl = \`\${baseUrl}/confirm-payment.html?status=pending&transaction_id=\${transactionData.order_id}\`;
        } else {
            redirectUrl = \`\${baseUrl}/failure.html?reason=test_transaction&transaction_id=\${transactionData.order_id}\`;
        }
        
        return {
            status: 'success',
            url: redirectUrl
        };`
        );
    }
    
    fs.writeFileSync(paykassaPath, content, 'utf8');
    console.log(`✓ Corregido: paykassa.js con credenciales de prueba`);
}

// Añadir meta tags para GitHub Pages
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Añadir meta tags si no existen
    if (!content.includes('<meta name="robots"')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            const metaTags = `
    <!-- Meta tags para GitHub Pages -->
    <meta name="robots" content="index, follow">
    <meta name="description" content="LuxMarket - Tu tienda online favorita con integración de pagos Paykassa">
    <meta name="author" content="Mauri">
    <meta property="og:title" content="LuxMarket | Tienda online con integración Paykassa">
    <meta property="og:description" content="Explora nuestra tienda online con integración de criptomonedas mediante Paykassa">
    <meta property="og:image" content="tienda-web/images/15.png">
    <meta property="og:url" content="https://mauri12345678.github.io/Paykassa/">
    <meta property="og:type" content="website">
`;
            content = content.substring(0, headEnd) + metaTags + content.substring(headEnd);
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`✓ Añadidos meta tags para SEO en index.html`);
        }
    }
}

// Crear un README.md si no existe
const readmePath = path.join(__dirname, 'README.md');
if (!fs.existsSync(readmePath)) {
    const readme = `# LuxMarket con Integración Paykassa

Tienda online ejemplo con integración del sistema de pagos Paykassa para criptomonedas.

## Características

- Diseño moderno y responsive
- Integración con sistema de pagos Paykassa
- Soporte para múltiples criptomonedas
- Flujo completo de checkout

## Demo

Visita la demo en vivo: [https://mauri12345678.github.io/Paykassa/](https://mauri12345678.github.io/Paykassa/)

## Estructura del proyecto

\`\`\`
webwebpago/
├── tienda-web/          # Código fuente original
│   ├── css/             # Estilos CSS
│   ├── js/              # Scripts JavaScript
│   ├── images/          # Imágenes y recursos
│   └── pages/           # Páginas internas
├── index.html           # Página principal
├── checkout.html        # Página de checkout
├── success.html         # Página de pago exitoso
├── failure.html         # Página de pago fallido
└── confirm-payment.html # Página de confirmación
\`\`\`

## Instrucciones de desarrollo

1. Clonar el repositorio
2. Navegar al directorio del proyecto
3. Abrir \`index.html\` en tu navegador

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Paykassa API para procesamiento de pagos

## Autor

Mauri - [GitHub](https://github.com/Mauri12345678)
`;
    fs.writeFileSync(readmePath, readme);
    console.log(`✓ Creado README.md para GitHub`);
}

// Crear una carpeta 'pages' en la raíz si no existe
const rootPagesDir = path.join(__dirname, 'pages');
if (!fs.existsSync(rootPagesDir)) {
    fs.mkdirSync(rootPagesDir, { recursive: true });
    console.log(`✓ Creada carpeta: pages/`);
}

// Copiar checkout.html a la carpeta pages/ en la raíz
const rootCheckoutPath = path.join(__dirname, 'checkout.html');
if (fs.existsSync(rootCheckoutPath)) {
    let checkoutContent = fs.readFileSync(rootCheckoutPath, 'utf8');
    fs.writeFileSync(path.join(rootPagesDir, 'checkout.html'), checkoutContent);
    console.log(`✓ Copiado checkout.html a pages/checkout.html`);
}

console.log('¡Proceso completado!');