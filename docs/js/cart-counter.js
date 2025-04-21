/**
 * Script común para el contador del carrito
 * Este archivo se incluye en todas las páginas
 */

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems' || event.key === 'cart') {
            updateCartCount();
        }
    });
});

/**
 * Actualiza el contador del carrito para mostrar productos únicos
 * en lugar de la cantidad total de items
 */
function updateCartCount() {
    let uniqueProductsCount = 0;
    
    // Primero intentamos el formato "cart" (array de objetos con múltiples cantidades)
    const cartFormat1 = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartFormat1.length > 0) {
        // Contar productos únicos (sin importar cantidad)
        const uniqueIds = new Set();
        cartFormat1.forEach(item => {
            uniqueIds.add(item.id || item.productId);
        });
        uniqueProductsCount = uniqueIds.size;
    } else {
        // Si no hay datos en el primer formato, intentar con "cartItems" (array de IDs)
        const cartFormat2 = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartFormat2.length > 0) {
            // Contar productos únicos (sin importar repeticiones)
            const uniqueIds = new Set(cartFormat2);
            uniqueProductsCount = uniqueIds.size;
        }
    }
    
    // Actualizar todos los contadores en la página
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(cartCount => {
        // Guardar valor anterior para verificar cambios
        const previousValue = cartCount.textContent;
        
        if (uniqueProductsCount > 0) {
            cartCount.textContent = uniqueProductsCount;
            cartCount.style.display = 'inline-flex';
            
            // Añadir animación si el valor cambió
            if (previousValue !== uniqueProductsCount.toString()) {
                cartCount.classList.remove('updated');
                // Truco para reiniciar la animación
                void cartCount.offsetWidth;
                cartCount.classList.add('updated');
            }
        } else {
            cartCount.textContent = '';
            cartCount.style.display = 'none';
        }
    });
}