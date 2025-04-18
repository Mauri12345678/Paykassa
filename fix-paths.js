const fs = require('fs');
const path = require('path');

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
        
        // Corregir rutas CSS, JS e imágenes
        content = content.replace(/href="\.\.\/css\//g, 'href="tienda-web/css/');
        content = content.replace(/href="\.\.\/images\//g, 'href="tienda-web/images/');
        content = content.replace(/src="\.\.\/js\//g, 'src="tienda-web/js/');
        content = content.replace(/src="\.\.\/images\//g, 'src="tienda-web/images/');
        content = content.replace(/src="\.\.\/assets\//g, 'src="tienda-web/assets/');
        
        // Corregir enlaces a páginas
        content = content.replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Corregido: ${file}`);
    } else {
        console.log(`✗ No encontrado: ${file}`);
    }
});

const filePath = path.join(__dirname, 'tienda-web/pages/checkout.html');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corregir rutas CSS, JS e imágenes - de formato tienda-web/... a ../...
    content = content.replace(/href="tienda-web\/css\//g, 'href="../css/');
    content = content.replace(/href="tienda-web\/images\//g, 'href="../images/');
    content = content.replace(/src="tienda-web\/js\//g, 'src="../js/');
    content = content.replace(/src="tienda-web\/images\//g, 'src="../images/');
    content = content.replace(/src="tienda-web\/assets\//g, 'src="../assets/');
    
    // Corregir enlaces a páginas
    content = content.replace(/href="index\.html"/g, 'href="../index.html"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Corregido: checkout.html en tienda-web/pages/`);
} else {
    console.log(`✗ No encontrado: checkout.html en tienda-web/pages/`);
}

console.log('¡Proceso completado!');