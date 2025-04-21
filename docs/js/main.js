// main.js

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    
    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartItems') {
            updateCartCount();
        }
    });
});

function loadProducts() {
    fetch('../data/products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return; // Si no estamos en la página de productos, salimos
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Actualiza la función addToCart
function addToCart(productId) {
    // Obtener los productos actuales del carrito
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Agregar el nuevo producto
    cartItems.push(productId);
    
    // Guardar en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // La función updateCartCount() ahora viene desde cart-counter.js
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Producto añadido al carrito');
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // Actualizamos todos los elementos con clase .cart-count en la página
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

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear la notificación si no existe
    let notification = document.querySelector('.cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }
    
    // Establecer mensaje y mostrar
    notification.textContent = message;
    notification.classList.add('show');
    
    // Quitar después de 2 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}