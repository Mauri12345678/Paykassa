/**
 * Script común para actualizar el contador del carrito en todas las páginas
 */

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems') {
            updateCartCount();
        }
    });
});

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(cartCount => {
        if (cartItems.length > 0) {
            cartCount.textContent = cartItems.length;
            cartCount.style.display = 'inline-flex';
        } else {
            cartCount.textContent = '0';
            cartCount.style.display = 'none';
        }
    });
}