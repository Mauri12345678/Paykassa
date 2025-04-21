// JavaScript para la funcionalidad del carrito de compras

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const cartItems = document.querySelectorAll('.cart-item');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clear-cart');
    const cartList = document.getElementById('cart-list');
    const cartEmpty = document.getElementById('cart-empty');
    
    // Variables de control
    let total = 0;
    
    // Actualizar total del carrito
    function updateCart() {
        // Contar items en el carrito
        const itemCount = document.querySelectorAll('.cart-item').length;
        
        // Mostrar mensaje de carrito vacío si no hay items
        if (itemCount === 0) {
            if (cartList) cartList.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (checkoutButton) checkoutButton.disabled = true;
            if (clearCartButton) clearCartButton.style.display = 'none';
        } else {
            if (cartList) cartList.style.display = 'block';
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (checkoutButton) checkoutButton.disabled = false;
            if (clearCartButton) clearCartButton.style.display = 'block';
        }
        
        // Calcular totales
        calculateTotals();
    }
    
    // Calcular subtotal, descuento y total
    function calculateTotals() {
        let subtotal = 0;
        let discount = 0;
        const shipping = 15; // Valor fijo de envío
        
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.current-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            
            // Actualizar total del item
            const totalElement = item.querySelector('.item-total span');
            totalElement.classList.add('updating');
            totalElement.textContent = `$${itemTotal.toFixed(2)}`;
            
            setTimeout(() => {
                totalElement.classList.remove('updating');
            }, 300);
        });
        
        // Calcular descuento (ejemplo: 10% si el subtotal es mayor a $500)
        if (subtotal > 500) {
            discount = subtotal * 0.1;
        }
        
        // Actualizar elementos en el DOM
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (discountElement) discountElement.textContent = `-$${discount.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${(subtotal - discount + shipping).toFixed(2)}`;
    }
    
    // Inicializar controladores de eventos
    function initEventHandlers() {
        // Botones de cantidad
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentNode.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (this.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                }
                
                calculateTotals();
            });
        });
        
        // Cambios directos en el input de cantidad
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                // Validar valor mínimo y máximo
                if (this.value < 1) this.value = 1;
                if (this.value > 10) this.value = 10;
                
                calculateTotals();
            });
        });
        
        // Botones para eliminar items
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.cart-item');
                
                // Animación de eliminación
                item.style.opacity = '0';
                item.style.transform = 'translateX(30px)';
                
                setTimeout(() => {
                    item.remove();
                    updateCart();
                }, 300);
            });
        });
        
        // Botón de checkout
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.add('loading');
                
                // Simular proceso de checkout
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 1500);
            });
        }
        
        // Botón de vaciar carrito
        if (clearCartButton) {
            clearCartButton.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    document.querySelectorAll('.cart-item').forEach(item => {
                        item.remove();
                    });
                    updateCart();
                }
            });
        }
    }
    
    // Inicializar carrito
    updateCart();
    initEventHandlers();
});