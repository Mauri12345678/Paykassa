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
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Corregido: ${file}`);
    } else {
        console.log(`✗ No encontrado: ${file}`);
    }
});

// Ahora corregir el checkout.html en la carpeta tienda-web/pages
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
    
    fs.writeFileSync(checkoutPath, content, 'utf8');
    console.log(`✓ Corregido: checkout.html en tienda-web/pages/`);
} else {
    console.log(`✗ No encontrado: checkout.html en tienda-web/pages/`);
}

// También corregir success.html si existe en tienda-web/pages
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

console.log('¡Proceso completado!');