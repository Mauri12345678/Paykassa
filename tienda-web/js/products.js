// JavaScript para la página de productos

document.addEventListener('DOMContentLoaded', function() {
    // Base de datos de productos (en producción esto vendría de un backend)
    const productDatabase = [
        {
            id: 1,
            name: "Smartphone XYZ Pro",
            price: 599.99,
            originalPrice: 649.99,
            image: "../img/product-1.jpg",
            category: "Electrónica",
            subcategory: "Smartphones",
            rating: 4.5,
            description: "El último modelo con pantalla AMOLED, cámara de 108MP y batería de larga duración.",
            featured: true,
            new: true,
            sale: true,
            stock: 15,
            specifications: {
                display: "6.7 pulgadas AMOLED",
                processor: "Snapdragon 888",
                ram: "8GB",
                storage: "128GB",
                camera: "108MP + 12MP + 8MP",
                battery: "5000mAh"
            }
        },
        {
            id: 2,
            name: "Auriculares SoundMax",
            price: 129.99,
            originalPrice: 149.99,
            image: "../img/product-2.jpg",
            category: "Audio",
            subcategory: "Auriculares",
            rating: 4.0,
            description: "Auriculares inalámbricos con cancelación de ruido y 30 horas de autonomía.",
            featured: true,
            new: false,
            sale: true,
            stock: 23,
            specifications: {
                type: "Over-ear",
                wireless: "Bluetooth 5.0",
                battery: "30 horas",
                features: "Cancelación activa de ruido"
            }
        },
        {
            id: 3,
            name: "Smartwatch FitPro",
            price: 199.99,
            originalPrice: null,
            image: "../img/product-3.jpg",
            category: "Relojes",
            subcategory: "Smartwatches",
            rating: 5.0,
            description: "Reloj inteligente con monitor cardíaco, GPS y más de 20 modos deportivos.",
            featured: true,
            new: false,
            sale: false,
            stock: 8,
            specifications: {
                display: "1.4 pulgadas AMOLED",
                sensors: "Ritmo cardíaco, GPS, acelerómetro",
                battery: "7 días",
                waterproof: "5 ATM"
            }
        },
        {
            id: 4,
            name: "Tablet UltraFast",
            price: 349.99,
            originalPrice: 399.99,
            image: "../img/product-4.jpg",
            category: "Electrónica",
            subcategory: "Tablets",
            rating: 4.2,
            description: "Tablet potente con pantalla de alta resolución y procesador de última generación.",
            featured: false,
            new: true,
            sale: true,
            stock: 12,
            specifications: {
                display: "10.5 pulgadas IPS LCD",
                processor: "A14 Bionic",
                ram: "6GB",
                storage: "128GB",
                battery: "10 horas"
            }
        },
        {
            id: 5,
            name: "Laptop ProBook",
            price: 899.99,
            originalPrice: 999.99,
            image: "../img/product-5.jpg",
            category: "Electrónica",
            subcategory: "Laptops",
            rating: 4.7,
            description: "Laptop profesional con rendimiento excepcional para productividad y creatividad.",
            featured: false,
            new: false,
            sale: true,
            stock: 5,
            specifications: {
                display: "15.6 pulgadas Full HD",
                processor: "Intel i7 11th Gen",
                ram: "16GB",
                storage: "512GB SSD",
                gpu: "NVIDIA GeForce RTX 3050"
            }
        },
        {
            id: 6,
            name: "Cámara DronePro",
            price: 849.99,
            originalPrice: null,
            image: "../img/product-6.jpg",
            category: "Fotografía",
            subcategory: "Drones",
            rating: 4.6,
            description: "Drone con cámara 4K y estabilizador para grabar videos profesionales.",
            featured: false,
            new: true,
            sale: false,
            stock: 7,
            specifications: {
                camera: "4K 60fps",
                flightTime: "30 minutos",
                range: "10km",
                features: "Estabilizador de 3 ejes, seguimiento automático"
            }
        }
    ];

    // Elementos del DOM
    const pageTitle = document.querySelector('.page-header h1');
    const productsContainer = document.querySelector('.products-container');
    const productTemplate = document.getElementById('product-template');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const sortSelect = document.getElementById('sort-products');
    const searchInput = document.getElementById('search-products');
    const noResults = document.getElementById('no-results');

    // Configuración inicial
    let currentProducts = [...productDatabase];
    let currentCategory = 'all';
    let currentSort = 'default';
    let searchTerm = '';

    // Inicializar la página
    initializePage();

    // Función para inicializar la página
    function initializePage() {
        // Completar la estructura del header
        const logo = document.querySelector('.logo');
        if (logo && logo.innerHTML === '') {
            logo.innerHTML = '<i class="fas fa-shopping-bag"></i> LuxMarket';
        }

        // Completar la navegación
        const nav = document.querySelector('nav');
        if (nav && nav.innerHTML === '') {
            nav.innerHTML = `
                <ul>
                    <li><a href="../index.html"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="product.html" class="active"><i class="fas fa-store"></i> Productos</a></li>
                    <li><a href="cart.html"><i class="fas fa-shopping-cart"></i> Carrito</a></li>
                    <li><a href="checkout.html"><i class="fas fa-credit-card"></i> Checkout</a></li>
                    <li><a href="contact.html"><i class="fas fa-envelope"></i> Contacto</a></li>
                </ul>
            `;
        }

        // Completar header de página
        const pageHeader = document.querySelector('.page-header .container');
        if (pageHeader && pageHeader.innerHTML === '') {
            pageHeader.innerHTML = `
                <h1>Nuestros Productos</h1>
                <div class="breadcrumb">
                    <a href="../index.html">Inicio</a> &gt; 
                    <span>Productos</span>
                </div>
            `;
        }

        // Completar estructura principal
        const mainContainer = document.querySelector('main .container');
        if (mainContainer && mainContainer.innerHTML === '') {
            mainContainer.innerHTML = `
                <div class="product-filters">
                    <div class="filter-group">
                        <h3>Categorías</h3>
                        <ul class="category-list">
                            <li><a href="#" class="category-filter active" data-category="all">Todas las categorías</a></li>
                            <li><a href="#" class="category-filter" data-category="Electrónica">Electrónica</a></li>
                            <li><a href="#" class="category-filter" data-category="Audio">Audio</a></li>
                            <li><a href="#" class="category-filter" data-category="Relojes">Relojes</a></li>
                            <li><a href="#" class="category-filter" data-category="Fotografía">Fotografía</a></li>
                        </ul>
                    </div>
                    <div class="filter-group">
                        <h3>Filtros</h3>
                        <div class="checkbox-filter">
                            <label>
                                <input type="checkbox" id="filter-sale">
                                <span>En oferta</span>
                            </label>
                        </div>
                        <div class="checkbox-filter">
                            <label>
                                <input type="checkbox" id="filter-new">
                                <span>Nuevos</span>
                            </label>
                        </div>
                    </div>
                    <div class="filter-group">
                        <h3>Precio</h3>
                        <div class="price-range">
                            <input type="range" id="price-range" min="0" max="1000" step="50">
                            <div class="price-labels">
                                <span>$0</span>
                                <span id="price-value">$1000</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-toolbar">
                        <div class="search-box">
                            <input type="text" id="search-products" placeholder="Buscar productos...">
                            <button id="search-btn"><i class="fas fa-search"></i></button>
                        </div>
                        <div class="sort-box">
                            <label for="sort-products">Ordenar por:</label>
                            <select id="sort-products">
                                <option value="default">Relevancia</option>
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-desc">Precio: Mayor a Menor</option>
                                <option value="name-asc">Nombre: A-Z</option>
                                <option value="name-desc">Nombre: Z-A</option>
                            </select>
                        </div>
                    </div>
                    
                    <div id="no-results" style="display: none;">
                        No se encontraron productos que coincidan con tu búsqueda.
                    </div>
                    
                    <div class="products-container"></div>
                </div>
            `;
        }

        // Completar footer
        const footer = document.querySelector('footer .container');
        if (footer && footer.innerHTML === '') {
            footer.innerHTML = `
                <div class="footer-content">
                    <div class="footer-column">
                        <h3>Enlaces rápidos</h3>
                        <ul>
                            <li><a href="../index.html"><i class="fas fa-chevron-right"></i> Inicio</a></li>
                            <li><a href="product.html"><i class="fas fa-chevron-right"></i> Productos</a></li>
                            <li><a href="cart.html"><i class="fas fa-chevron-right"></i> Carrito</a></li>
                            <li><a href="checkout.html"><i class="fas fa-chevron-right"></i> Checkout</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Información</h3>
                        <ul>
                            <li><a href="#"><i class="fas fa-chevron-right"></i> Sobre nosotros</a></li>
                            <li><a href="#"><i class="fas fa-chevron-right"></i> Envíos</a></li>
                            <li><a href="#"><i class="fas fa-chevron-right"></i> Política de privacidad</a></li>
                            <li><a href="#"><i class="fas fa-chevron-right"></i> Términos y condiciones</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Contacto</h3>
                        <ul>
                            <li><i class="fas fa-map-marker-alt"></i> Av. Corrientes 1234, CABA</li>
                            <li><i class="fas fa-phone"></i> +54 11 1234-5678</li>
                            <li><i class="fas fa-envelope"></i> info@luxmarket.com</li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Síguenos</h3>
                        <div class="social-icons">
                            <a href="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 LuxMarket. Todos los derechos reservados.</p>
                </div>
            `;
        }

        // Completar plantilla de producto si está vacía
        const productTemplateContent = document.querySelector('#product-template .product-card');
        if (productTemplate && (!productTemplateContent || productTemplateContent.innerHTML === '')) {
            productTemplate.innerHTML = `
                <div class="product-card">
                    <div class="product-badges"></div>
                    <div class="product-image">
                        <img src="" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-category"></div>
                        <h3 class="product-name"></h3>
                        <div class="product-rating"></div>
                        <div class="product-price"></div>
                        <p class="product-description"></p>
                        <div class="product-actions">
                            <a href="#" class="btn btn-primary view-product"><i class="fas fa-eye"></i> Ver detalles</a>
                            <button class="btn btn-secondary add-to-cart"><i class="fas fa-shopping-cart"></i> Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Renderizar productos
        renderProducts(currentProducts);

        // Event Listeners para filtros y búsqueda
        setupEventListeners();
    }

    // Función para renderizar productos
    function renderProducts(products) {
        if (!productsContainer) return;
        
        productsContainer.innerHTML = '';
        
        if (products.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            
            // Badges (New, Sale)
            const badges = document.createElement('div');
            badges.className = 'product-badges';
            
            if (product.new) {
                const newBadge = document.createElement('span');
                newBadge.className = 'product-badge new';
                newBadge.textContent = 'Nuevo';
                badges.appendChild(newBadge);
            }
            
            if (product.sale && product.originalPrice) {
                const saleBadge = document.createElement('span');
                saleBadge.className = 'product-badge sale';
                const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                saleBadge.textContent = `-${discountPercent}%`;
                badges.appendChild(saleBadge);
            }
            
            // Imagen
            const imageContainer = document.createElement('div');
            imageContainer.className = 'product-image';
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.name;
            imageContainer.appendChild(image);
            
            // Info del producto
            const infoContainer = document.createElement('div');
            infoContainer.className = 'product-info';
            
            const category = document.createElement('div');
            category.className = 'product-category';
            category.textContent = product.category;
            
            const name = document.createElement('h3');
            name.className = 'product-name';
            name.textContent = product.name;
            
            // Rating
            const rating = document.createElement('div');
            rating.className = 'product-rating';
            
            const fullStars = Math.floor(product.rating);
            const halfStar = product.rating % 1 >= 0.5;
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                if (i <= fullStars) {
                    star.className = 'fas fa-star';
                } else if (i === fullStars + 1 && halfStar) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                rating.appendChild(star);
            }
            
            // Precio
            const price = document.createElement('div');
            price.className = 'product-price';
            
            const currentPrice = document.createElement('span');
            currentPrice.textContent = `$${product.price.toFixed(2)}`;
            
            price.appendChild(currentPrice);
            
            if (product.originalPrice) {
                const originalPrice = document.createElement('span');
                originalPrice.className = 'original-price';
                originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
                price.appendChild(originalPrice);
            }
            
            // Descripción
            const description = document.createElement('p');
            description.className = 'product-description';
            description.textContent = product.description;
            
            // Acciones (botones)
            const actions = document.createElement('div');
            actions.className = 'product-actions';
            
            const viewButton = document.createElement('a');
            viewButton.href = `#`;
            viewButton.className = 'btn btn-primary view-product';
            viewButton.innerHTML = '<i class="fas fa-eye"></i> Ver detalles';
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                viewProductDetails(product.id);
            });
            
            const addToCartButton = document.createElement('button');
            addToCartButton.className = 'btn btn-secondary add-to-cart';
            addToCartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al carrito';
            addToCartButton.dataset.id = product.id;
            addToCartButton.addEventListener('click', function() {
                addToCart(product);
            });
            
            actions.appendChild(viewButton);
            actions.appendChild(addToCartButton);
            
            // Agregar todo al contenedor de información
            infoContainer.appendChild(category);
            infoContainer.appendChild(name);
            infoContainer.appendChild(rating);
            infoContainer.appendChild(price);
            infoContainer.appendChild(description);
            infoContainer.appendChild(actions);
            
            // Agregar todo a la tarjeta de producto
            productCard.appendChild(badges);
            productCard.appendChild(imageContainer);
            productCard.appendChild(infoContainer);
            
            // Agregar la tarjeta al contenedor de productos
            productsContainer.appendChild(productCard);
        });
    }

    // Función para configurar event listeners
    function setupEventListeners() {
        // Filtros de categoría
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                currentCategory = this.dataset.category;
                filterProducts();
            });
        });
        
        // Filtro de ofertas
        const saleFilter = document.getElementById('filter-sale');
        if (saleFilter) {
            saleFilter.addEventListener('change', filterProducts);
        }
        
        // Filtro de nuevos
        const newFilter = document.getElementById('filter-new');
        if (newFilter) {
            newFilter.addEventListener('change', filterProducts);
        }
        
        // Filtro de rango de precio
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', function() {
                priceValue.textContent = `$${this.value}`;
                filterProducts();
            });
        }
        
        // Ordenamiento
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSort = this.value;
                filterProducts();
            });
        }
        
        // Búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchTerm = this.value.toLowerCase().trim();
                filterProducts();
            });
            
            const searchBtn = document.getElementById('search-btn');
            if (searchBtn) {
                searchBtn.addEventListener('click', function() {
                    searchTerm = searchInput.value.toLowerCase().trim();
                    filterProducts();
                });
            }
        }
    }

    // Función para filtrar productos
    function filterProducts() {
        let filtered = [...productDatabase];
        
        // Filtrar por categoría
        if (currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === currentCategory);
        }
        
        // Filtrar por ofertas
        const saleFilter = document.getElementById('filter-sale');
        if (saleFilter && saleFilter.checked) {
            filtered = filtered.filter(product => product.sale);
        }
        
        // Filtrar por nuevos
        const newFilter = document.getElementById('filter-new');
        if (newFilter && newFilter.checked) {
            filtered = filtered.filter(product => product.new);
        }
        
        // Filtrar por precio
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
            filtered = filtered.filter(product => product.price <= parseFloat(priceRange.value));
        }
        
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Ordenar productos
        switch (currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Por defecto ordenar por destacados primero
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        
        // Actualizar productos visibles
        currentProducts = filtered;
        renderProducts(currentProducts);
    }

    // Función para ver detalles del producto
    function viewProductDetails(productId) {
        const product = productDatabase.find(p => p.id === productId);
        if (!product) return;
        
        // En un caso real, redirigirías a una página de detalles
        // Para este ejemplo, mostramos un alert con la información
        alert(`
            Detalles del producto: ${product.name}
            
            Precio: $${product.price.toFixed(2)}
            Categoría: ${product.category}
            Descripción: ${product.description}
            
            En una implementación real, esta sería una página de detalles completa.
        `);
    }

    // Función para añadir al carrito
    function addToCart(product) {
        // Cargar el carrito actual desde localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Incrementar cantidad
            existingItem.quantity += 1;
        } else {
            // Añadir nuevo item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Mostrar mensaje de éxito
        showNotification(`${product.name} añadido al carrito`);
    }

    // Función para mostrar notificación
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Añadir al cuerpo del documento
        document.body.appendChild(notification);
        
        // Mostrar la notificación con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// Añadir estilos necesarios para la notificación
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #2ecc71;
    color: white;
    padding: 0;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 9999;
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    gap: 10px;
}

.notification i {
    font-size: 1.2rem;
}
`;
document.head.appendChild(style);