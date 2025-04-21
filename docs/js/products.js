

// Eliminar completamente elementos product-filters vacíos
document.addEventListener('DOMContentLoaded', function() {
  const filters = document.querySelector('.product-filters');
  if (filters && !filters.children.length) {
    filters.remove();
  }
});

// Renderizar productos en el contenedor existente de tu HTML
document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.querySelector('main .container');
    if (!mainContainer) return;

    const productsList = document.createElement('div');
    productsList.className = 'products-container';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Añadir al carrito
                </button>
            </div>
        `;
        productsList.appendChild(div);
    });

    mainContainer.appendChild(productsList);

    // Lógica para añadir al carrito con feedback visual
    productsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
            // Feedback visual
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al carrito';
            }, 1200);
        }
    });
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Cambiar entre vista de cuadrícula y lista
document.addEventListener('DOMContentLoaded', function() {
    const viewToggleButtons = document.querySelectorAll('.view-toggle button');
    const productsContainer = document.querySelector('.products-container');
    
    if (viewToggleButtons.length && productsContainer) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Quitar la clase active de todos los botones
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Añadir la clase active al botón clicado
                this.classList.add('active');
                
                // Cambiar la vista según el botón
                const viewType = this.dataset.view;
                if (viewType === 'list') {
                    productsContainer.classList.add('list-view');
                } else {
                    productsContainer.classList.remove('list-view');
                }
            });
        });
    }
    
    // Manejar el toggle de filtros en móvil
    const filterToggle = document.querySelector('.filter-toggle-mobile');
    const filters = document.querySelector('.product-filters');
    const filterClose = document.querySelector('.filter-close');
    
    if (filterToggle && filters) {
        filterToggle.addEventListener('click', function() {
            filters.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        });
    }
    
    if (filterClose && filters) {
        filterClose.addEventListener('click', function() {
            filters.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        });
    }
});
