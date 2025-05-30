// Importar configuración
// NOTA: Asegúrate de incluir paykassa-config.js antes de paykassa.js en tu HTML
// <script src="tienda-web/js/paykassa-config.js"></script>
// <script src="tienda-web/js/paykassa.js"></script>

/**
 * Integración con Paykassa para procesamiento de pagos
 */

class PaykassaIntegration {
    constructor(shopId, secretKey, testMode = false) {
        // Usar configuración global si está disponible
        this.shopId = shopId || (window.paykassaConfig ? window.paykassaConfig.merchantId : '64135');
        this.secretKey = secretKey || 'sandbox_api_key';
        this.testMode = testMode || (window.paykassaConfig ? window.paykassaConfig.testMode : false);
        this.apiUrl = 'https://api.paykassa.app/v1/';
    }

    /**
     * Inicializa los manejadores de eventos para Paykassa
     */
    init() {
        // Seleccionar el formulario de checkout
        const checkoutForm = document.getElementById('checkout-form');
        const paykassaOption = document.getElementById('payment-paykassa');
        
        if (checkoutForm && paykassaOption) {
            // Mostrar los detalles de Paykassa cuando se selecciona como método de pago
            document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
                radio.addEventListener('change', this.togglePaymentDetails.bind(this));
            });

            // Manejar el envío del formulario
            checkoutForm.addEventListener('submit', this.handleFormSubmission.bind(this));
        }

        // Crear div para los detalles de Paykassa
        this.createPaykassaDetailsSection();

        // Asegurarse de que exista el elemento processing-overlay
        if (!document.getElementById('processing-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'processing-overlay';
            overlay.style.display = 'none';
            overlay.innerHTML = `
                <div class="processing-content">
                    <div class="spinner"></div>
                    <h3>Procesando tu pago</h3>
                    <p>Por favor espera mientras conectamos con Paykassa...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        // Guardar la instancia para acceso global
        window.paykassaInstance = this;
    }

    /**
     * Crea la sección para los detalles de pago de Paykassa
     */
    createPaykassaDetailsSection() {
        // Crear la sección de detalles solo si no existe
        if (!document.getElementById('paykassa-details')) {
            const paykassaDetails = document.createElement('div');
            paykassaDetails.id = 'paykassa-details';
            paykassaDetails.style.display = 'none';
            paykassaDetails.innerHTML = `
                <div class="paykassa-options">
                    <h4>Selecciona un método de pago</h4>
                    <div class="crypto-options">
                        <div class="crypto-option">
                            <input type="radio" id="payment-btc" name="crypto-method" value="BTC">
                            <label for="payment-btc">
                                <div class="crypto-logo">
                                    <i class="fab fa-bitcoin"></i>
                                </div>
                                <div class="crypto-info">
                                    <h4>Bitcoin</h4>
                                </div>
                            </label>
                        </div>
                        <div class="crypto-option">
                            <input type="radio" id="payment-eth" name="crypto-method" value="ETH">
                            <label for="payment-eth">
                                <div class="crypto-logo">
                                    <i class="fab fa-ethereum"></i>
                                </div>
                                <div class="crypto-info">
                                    <h4>Ethereum</h4>
                                </div>
                            </label>
                        </div>
                        <div class="crypto-option">
                            <input type="radio" id="payment-usdt" name="crypto-method" value="USDT">
                            <label for="payment-usdt">
                                <div class="crypto-logo">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="crypto-info">
                                    <h4>USDT</h4>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <p class="paykassa-note">Después de hacer clic en "Finalizar compra", serás redirigido a la página de pago segura de Paykassa.</p>
            `;
            
            // Insertar después de los detalles de la tarjeta
            const cardDetails = document.getElementById('card-payment-details');
            if (cardDetails) {
                cardDetails.parentNode.insertBefore(paykassaDetails, cardDetails.nextSibling);
            }
        }
    }

    /**
     * Muestra u oculta los detalles de pago según el método seleccionado
     */
    togglePaymentDetails() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Ocultar todos los detalles de pago que existan
        const cardDetails = document.getElementById('card-payment-details');
        const paykassaDetails = document.getElementById('paykassa-details');
        const paypalDetails = document.getElementById('paypal-details');
        const transferDetails = document.getElementById('bank-transfer-details');
        
        if (cardDetails) cardDetails.style.display = 'none';
        if (paykassaDetails) paykassaDetails.style.display = 'none';
        if (paypalDetails) paypalDetails.style.display = 'none';
        if (transferDetails) transferDetails.style.display = 'none';
        
        // Mostrar los detalles correspondientes
        switch(selectedMethod) {
            case 'card':
                if (cardDetails) cardDetails.style.display = 'block';
                break;
            case 'paykassa':
                if (paykassaDetails) paykassaDetails.style.display = 'block';
                break;
            case 'paypal':
                if (paypalDetails) paypalDetails.style.display = 'block';
                break;
            case 'transfer':
                if (transferDetails) transferDetails.style.display = 'block';
                break;
        }
    }

    /**
     * Maneja el envío del formulario para crear una transacción con Paykassa
     * @param {Event} event - Evento de formulario
     */
    async handleFormSubmission(event) {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Solo procesar si se selecciona Paykassa
        if (selectedMethod === 'paykassa') {
            event.preventDefault();
            
            // Validar el formulario antes de proceder
            if (!this.validateForm()) {
                return;
            }
            
            // Mostrar pantalla de carga
            this.showProcessingOverlay();
            
            try {
                // Obtener los datos del pedido
                const orderData = this.collectOrderData();
                
                // Crear la solicitud a Paykassa
                const response = await this.createPaykassaTransaction(orderData);
                
                if (response && response.url) {
                    // Guardar datos del pedido en localStorage para recuperar después
                    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
                    
                    // Redirigir a la página de pago de Paykassa
                    window.location.href = response.url;
                } else {
                    throw new Error('No se recibió URL de pago');
                }
            } catch (error) {
                this.hideProcessingOverlay();
                this.showError('Hubo un problema al procesar el pago. Por favor intenta nuevamente.');
                console.error('Error de Paykassa:', error);
            }
        }
    }

    /**
     * Valida el formulario antes de crear la transacción
     * @returns {boolean} - Indica si el formulario es válido
     */
    validateForm() {
        // Implementar validación básica del formulario
        const requiredFields = [
            'first-name', 'last-name', 'email', 'phone', 
            'address', 'city', 'postal-code', 'country'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        // Validar que se haya seleccionado un método de criptomoneda
        if (!document.querySelector('input[name="crypto-method"]:checked')) {
            isValid = false;
            this.showError('Por favor selecciona un método de pago con criptomoneda');
        }
        
        return isValid;
    }

    /**
     * Recopila los datos del pedido del formulario
     */
    collectOrderData() {
        const cartItems = this.getCartItems();
        const total = this.calculateTotal(cartItems);
        const selectedCrypto = document.querySelector('input[name="crypto-method"]:checked').value;
        
        return {
            order_id: 'ORD-' + Date.now(),
            amount: total,
            currency: 'USD',
            crypto: selectedCrypto,
            items: cartItems,
            customer: {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postal-code').value,
                country: document.getElementById('country').value
            }
        };
    }

    /**
     * Obtiene los elementos del carrito desde el DOM o el almacenamiento
     */
    getCartItems() {
        // En una implementación real, esto vendría de localStorage o de una API
        const cartItems = [];
        
        document.querySelectorAll('.cart-item').forEach(item => {
            const name = item.querySelector('h4').textContent;
            const price = parseFloat(item.querySelector('.item-price').textContent.replace(/[^0-9.-]+/g, ''));
            const quantity = parseInt(item.querySelector('.item-quantity').textContent.replace(/[^0-9]/g, '')) || 1;
            
            cartItems.push({
                name,
                price,
                quantity
            });
        });
        
        // Si no hay items en el DOM, intentar obtenerlos del localStorage
        if (cartItems.length === 0) {
            const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            return storedCart;
        }
        
        return cartItems;
    }

    /**
     * Calcula el total de la compra
     */
    calculateTotal(items) {
        // Calcular el subtotal de los items
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Añadir envío e impuestos
        const shipping = parseFloat(document.getElementById('shipping').textContent.replace(/[^0-9.-]+/g, '')) || 0;
        const tax = parseFloat(document.getElementById('tax').textContent.replace(/[^0-9.-]+/g, '')) || 0;
        
        return subtotal + shipping + tax;
    }

    /**
     * Crea una transacción en Paykassa
     * @param {Object} orderData - Datos del pedido
     */
    async createPaykassaTransaction(orderData) {
        try {
            // Construir datos para la API de Paykassa
            const transactionData = {
                shop_id: this.shopId,
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.order_id,
                payment_system: orderData.crypto,
                fields: {
                    email: orderData.customer.email,
                    us_result: window.location.origin + '/confirm-payment.html',
                    us_success: window.location.origin + '/success.html',
                    us_failure: window.location.origin + '/failure.html',
                    comment: `Pedido: ${orderData.order_id}`
                }
            };

            // Aquí deberías hacer una llamada a TU BACKEND, no directamente a la API de Paykassa
            // Ejemplo usando fetch a tu backend:
            const response = await fetch('https://paykassa.vercel.app/api/paykassa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });
            const data = await response.json();

            if (data && data.url) {
                return data;
            } else {
                throw new Error('No se recibió URL de pago');
            }
        } catch (error) {
            console.error('Error al crear transacción:', error);
            throw error;
        }
    }

    /**
     * Muestra la pantalla de procesamiento
     */
    showProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    /**
     * Oculta la pantalla de procesamiento
     */
    hideProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Muestra un mensaje de error
     */
    showError(message) {
        const errorContainer = document.getElementById('form-errors');
        const errorMessage = document.getElementById('error-message');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.style.display = 'block';
            
            // Scroll hasta el error
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Ocultar después de 10 segundos
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 10000);
        }
    }
}

// Inicializar la integración cuando se cargue el documento
document.addEventListener('DOMContentLoaded', () => {
    const paykassa = new PaykassaIntegration('AQUI_TU_SHOP_ID', '', false);
    paykassa.init();
});