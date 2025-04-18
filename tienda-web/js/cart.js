// JavaScript para la funcionalidad del carrito de compras

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Renderizar el carrito inicialmente
    renderCart();
    
    // Función para renderizar el carrito
    function renderCart() {
        const cartContainer = document.getElementById('cart-list');
        const emptyCartMessage = document.getElementById('cart-empty');
        const checkoutButton = document.getElementById('checkout-button');
        const clearCartButton = document.getElementById('clear-cart');
        const cartCountText = document.getElementById('cart-count-text');
        
        // Actualizar contador
        const cartCount = document.getElementById('cart-count');
        if(cartCount) cartCount.textContent = cart.length;
        if(cartCountText) cartCountText.textContent = cart.length;
        
        // Si el carrito está vacío
        if (cart.length === 0) {
            if(emptyCartMessage) emptyCartMessage.style.display = 'block';
            if(cartContainer) cartContainer.innerHTML = '';
            if(checkoutButton) {
                checkoutButton.disabled = true;
                checkoutButton.style.opacity = '0.5';
            }
            if(clearCartButton) clearCartButton.style.display = 'none';
            
            // Actualizar totales
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');
            if(subtotalElement) subtotalElement.textContent = '$0.00';
            if(totalElement) totalElement.textContent = '$0.00';
            return;
        }
        
        // Si hay productos en el carrito
        if(emptyCartMessage) emptyCartMessage.style.display = 'none';
        if(checkoutButton) {
            checkoutButton.disabled = false;
            checkoutButton.style.opacity = '1';
        }
        if(clearCartButton) clearCartButton.style.display = 'block';
        
        // Limpiar contenedor
        if(!cartContainer) return;
        cartContainer.innerHTML = '';
        
        // Variables para calcular el total
        let subtotal = 0;
        
        // Renderizar cada producto
        cart.forEach((item, index) => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            // Estructura HTML del item del carrito
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || '../img/product-placeholder.jpg'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${itemSubtotal.toFixed(2)}
                </div>
                <button class="remove-item-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartContainer.appendChild(cartItemElement);
        });

        // Actualizar totales
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        if(subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if(totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;
        
        // Añadir event listeners a los botones de cantidad y eliminar
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeItem);
        });
        
        // Verificar si hay descuento aplicado
        checkAppliedDiscount(subtotal);
        
        // Actualizar minicarrito si existe
        updateMiniCart();
    }
    
    // Función para disminuir la cantidad
    function decreaseQuantity() {
        const index = parseInt(this.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            updateCart();
        }
    }
    
    // Función para aumentar la cantidad
    function increaseQuantity() {
        const index = parseInt(this.dataset.index);
        cart[index].quantity++;
        updateCart();
    }
    
    // Función para eliminar un item
    function removeItem() {
        const index = parseInt(this.dataset.index);
        cart.splice(index, 1);
        updateCart();
        
        // Mostrar notificación
        showNotification('Producto eliminado del carrito', 'warning');
    }
    
    // Función para actualizar el carrito
    function updateCart() {
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar visualización
        renderCart();
    }
    
    // Event listener para vaciar el carrito
    const clearCartButton = document.getElementById('clear-cart');
    if(clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cart = [];
                updateCart();
                showNotification('Se ha vaciado el carrito', 'warning');
            }
        });
    }
    
    // Event listener para aplicar cupón
    const couponForm = document.querySelector('.coupon-form');
    if (couponForm) {
        couponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const couponInput = this.querySelector('input');
            const couponCode = couponInput.value.trim();
            
            if (couponCode) {
                // Verificar cupones válidos (en producción esto se haría con una API)
                const validCoupons = {
                    'DESCUENTO10': 10,
                    'DESCUENTO20': 20,
                    'DESCUENTO30': 30,
                    'LUXMARKET50': 50
                };
                
                const percentage = validCoupons[couponCode.toUpperCase()];
                
                if (percentage) {
                    // Calcular descuento
                    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
                    const discount = subtotal * (percentage / 100);
                    
                    // Actualizar totales con descuento
                    const total = subtotal - discount;
                    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
                    
                    // Añadir fila de descuento en el resumen
                    const summaryDetails = document.querySelector('.summary-details');
                    const totalRow = document.querySelector('.summary-row.total');
                    
                    // Verificar si ya existe una fila de descuento
                    const existingDiscountRow = document.querySelector('.summary-row.discount');
                    if (existingDiscountRow) {
                        existingDiscountRow.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
                    } else if (summaryDetails && totalRow) {
                        // Crear nueva fila de descuento
                        const discountRow = document.createElement('div');
                        discountRow.className = 'summary-row discount';
                        discountRow.innerHTML = `
                            <span>Descuento (${percentage}%)</span>
                            <span style="color: #2ecc71">-$${discount.toFixed(2)}</span>
                        `;
                        
                        // Insertar antes de la fila de total
                        summaryDetails.insertBefore(discountRow, totalRow);
                    }
                    
                    // Guardar el descuento en el localStorage para usarlo en checkout
                    localStorage.setItem('cartDiscount', JSON.stringify({
                        code: couponCode,
                        percentage: percentage,
                        amount: discount
                    }));
                    
                    // Notificar al usuario
                    showNotification(`¡Cupón aplicado con éxito! ${percentage}% de descuento.`, 'success');
                } else {
                    showNotification('Cupón inválido o expirado.', 'error');
                }
                couponInput.value = '';
            }
        });
    }
    
    // Función para verificar si hay descuento aplicado
    function checkAppliedDiscount(subtotal) {
        const discountData = JSON.parse(localStorage.getItem('cartDiscount'));
        if (discountData) {
            // Recalcular el descuento sobre el subtotal actual
            const percentage = discountData.percentage;
            const discount = subtotal * (percentage / 100);
            const total = subtotal - discount;
            
            const totalElement = document.getElementById('total');
            if(totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
            
            const summaryDetails = document.querySelector('.summary-details');
            const totalRow = document.querySelector('.summary-row.total');
            
            if(summaryDetails && totalRow) {
                const existingDiscountRow = document.querySelector('.summary-row.discount');
                if (existingDiscountRow) {
                    existingDiscountRow.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
                } else {
                    const discountRow = document.createElement('div');
                    discountRow.className = 'summary-row discount';
                    discountRow.innerHTML = `
                        <span>Descuento (${percentage}%)</span>
                        <span style="color: #2ecc71">-$${discount.toFixed(2)}</span>
                    `;
                    summaryDetails.insertBefore(discountRow, totalRow);
                }
                
                // Actualizar el descuento en localStorage con el nuevo monto
                discountData.amount = discount;
                localStorage.setItem('cartDiscount', JSON.stringify(discountData));
            }
        }
    }
    
    // Event listener para el botón de checkout
    const checkoutButton = document.getElementById('checkout-button');
    if(checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            if (cart.length === 0) {
                e.preventDefault();
                showNotification('Tu carrito está vacío. Añade productos antes de proceder al pago.', 'error');
            } else {
                // Opcional: guardar el timestamp de la última actualización del carrito
                localStorage.setItem('cartLastUpdated', new Date().toISOString());
            }
        });
    }
    
    // Función para mostrar notificación
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Cerrar notificación al hacer clic en el botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // Eliminar notificación automáticamente después de 4 segundos
        setTimeout(() => {
            notification.classList.add('notification-hidden');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        // Mostrar la notificación con una animación
        setTimeout(() => {
            notification.classList.add('notification-visible');
        }, 10);
    }
    
    // Función para actualizar el mini-carrito en todas las páginas
    function updateMiniCart() {
        const miniCartItems = document.querySelector('.mini-cart-items');
        const miniCartTotal = document.querySelector('.mini-cart-total');
        const miniCartCount = document.querySelector('.mini-cart-count');
        
        if (!miniCartItems) return;
        
        // Limpiar contenedor
        miniCartItems.innerHTML = '';
        
        if (cart.length === 0) {
            miniCartItems.innerHTML = '<div class="mini-cart-empty">Tu carrito está vacío</div>';
            if(miniCartTotal) miniCartTotal.textContent = '$0.00';
            if(miniCartCount) miniCartCount.textContent = '0';
            return;
        }
        
        let subtotal = 0;
        let totalItems = 0;
        
        // Mostrar solo los primeros 3 productos en el mini carrito
        const displayLimit = 3;
        const displayItems = cart.slice(0, displayLimit);
        
        displayItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            totalItems += item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'mini-cart-item';
            itemElement.innerHTML = `
                <div class="mini-cart-item-image">
                    <img src="${item.image || '../img/product-placeholder.jpg'}" alt="${item.name}">
                </div>
                <div class="mini-cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="mini-cart-item-details">
                        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            miniCartItems.appendChild(itemElement);
        });
        
        // Si hay más productos de los que se muestran
        if (cart.length > displayLimit) {
            const remainingElement = document.createElement('div');
            remainingElement.className = 'mini-cart-more';
            remainingElement.textContent = `Y ${cart.length - displayLimit} producto(s) más...`;
            miniCartItems.appendChild(remainingElement);
        }
        
        // Calcular total para todos los productos
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
        });
        
        // Verificar si hay descuento
        const discountData = JSON.parse(localStorage.getItem('cartDiscount'));
        let finalTotal = subtotal;
        if (discountData) {
            const discount = subtotal * (discountData.percentage / 100);
            finalTotal = subtotal - discount;
        }
        
        if(miniCartTotal) miniCartTotal.textContent = `$${finalTotal.toFixed(2)}`;
        if(miniCartCount) miniCartCount.textContent = totalItems.toString();
    }
    
    // Exportar funciones para uso global
    window.cartFunctions = {
        addToCart: function(product) {
            // Verificar si el producto ya está en el carrito
            const existingItemIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingItemIndex !== -1) {
                // Incrementar cantidad si ya existe
                cart[existingItemIndex].quantity += product.quantity || 1;
            } else {
                // Añadir nuevo producto
                cart.push({
                    ...product,
                    quantity: product.quantity || 1
                });
            }
            
            updateCart();
            showNotification(`${product.name} añadido al carrito`, 'success');
            
            // Opcional: mostrar el mini carrito
            const miniCart = document.querySelector('.mini-cart');
            if (miniCart) {
                miniCart.classList.add('mini-cart-active');
                setTimeout(() => {
                    miniCart.classList.remove('mini-cart-active');
                }, 3000);
            }
        },
        
        getCartCount: function() {
            return cart.reduce((total, item) => total + item.quantity, 0);
        },
        
        getCartTotal: function() {
            let subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const discountData = JSON.parse(localStorage.getItem('cartDiscount'));
            
            if (discountData) {
                const discount = subtotal * (discountData.percentage / 100);
                return subtotal - discount;
            }
            
            return subtotal;
        }
    };
    
    // CSS para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1000;
            max-width: 350px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification-visible {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-hidden {
            transform: translateY(100px);
            opacity: 0;
        }
        
        .notification-icon {
            font-size: 1.5rem;
        }
        
        .notification.success .notification-icon {
            color: #2ecc71;
        }
        
        .notification.error .notification-icon {
            color: #e74c3c;
        }
        
        .notification.warning .notification-icon {
            color: #f39c12;
        }
        
        .notification.info .notification-icon {
            color: #3498db;
        }
        
        .notification-message {
            flex: 1;
            font-size: 0.95rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #7f8c8d;
        }
        
        .mini-cart {
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            width: 320px;
            z-index: 999;
            transform: translateY(-20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
        }
        
        .mini-cart-active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
    `;
    document.head.appendChild(style);
});