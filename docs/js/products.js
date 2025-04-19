// Base de datos de productos
const products = [
    {
        id: 1,
        name: "Producto A",
        price: 1.00,
        image: "images/5.jpeg",
        description: "Producto de prueba A por solo $1."
    },
    {
        id: 2,
        name: "Producto B",
        price: 1.00,
        image: "images/15.png",
        description: "Producto de prueba B por solo $1."
    }
];

// Renderizar productos
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

// Insertar productos en el contenedor principal
const mainContainer = document.querySelector('main .container');
if (mainContainer) {
    mainContainer.appendChild(productsList);
}

// Lógica para añadir al carrito con feedback visual
productsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const btn = e.target.closest('.add-to-cart');
        const id = parseInt(btn.getAttribute('data-id'));
        const product = products.find(p => p.id === id);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        // Feedback visual
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al carrito';
        }, 1200);
    }
});