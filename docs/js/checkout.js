document.addEventListener('DOMContentLoaded', function() {
    // Carga los datos del carrito en checkout
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = document.getElementById('order-summary');
    
    // Si no hay productos en el carrito, redirigir al carrito
    if (cart.length === 0) {
        alert('No hay productos en tu carrito');
        window.location.href = 'cart.html';
        return;
    }
    
    // Función para renderizar el resumen de productos
    function renderOrderSummary() {
        if (!orderSummary) return;
        
        let html = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            html += `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${item.price.toFixed(2)}</div>
                        <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        const tax = subtotal * 0.10; // 10% de impuesto
        const total = subtotal + tax;
        
        // Añade el resumen de totales
        html += `
            <div class="order-summary-totals">
                <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
                <div class="summary-row"><span>Impuestos (10%)</span><span>$${tax.toFixed(2)}</span></div>
                <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
            </div>
        `;
        
        orderSummary.innerHTML = html;
    }
    
    // Renderizar el resumen
    renderOrderSummary();
    
    // Obtener referencias a elementos del formulario
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutButton = document.getElementById('checkout-button');
    const cardNumber = document.getElementById('card-number');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardPaymentDetails = document.getElementById('card-payment-details');
    
    // Manejar cambios en el método de pago
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Mostrar/ocultar los detalles de la tarjeta según el método seleccionado
            if (this.value === 'card') {
                cardPaymentDetails.style.display = 'block';
            } else {
                cardPaymentDetails.style.display = 'none';
            }

            // Mostrar mensaje aclaratorio y ocultar formulario de tarjeta si es card o paykassa
            const paykassaNotice = document.getElementById('paykassa-notice');
            if (this.value === 'card' || this.value === 'paykassa') {
                cardPaymentDetails.style.display = 'none';
                if (paykassaNotice) {
                    paykassaNotice.style.display = 'block';
                }
            } else {
                if (paykassaNotice) {
                    paykassaNotice.style.display = 'none';
                }
            }

            // Para otros métodos de pago, puedes añadir más lógica aquí
            if (this.value === 'paykassa') {
                // Por ejemplo, mostrar selector de criptomonedas
                showCryptoOptions();
            } else if (this.value === 'transfer') {
                // Mostrar información de transferencia bancaria
            }
        });
    });
    
    // Función para mostrar opciones de criptomoneda para Paykassa
    function showCryptoOptions() {
        // Si ya existe un contenedor de opciones crypto, no lo vuelvas a crear
        if (document.getElementById('crypto-options')) return;
        
        const paykassaOption = document.querySelector('label[for="payment-paykassa"]').parentNode;
        
        // Crear el contenedor de opciones de criptomoneda
        const cryptoOptions = document.createElement('div');
        cryptoOptions.id = 'crypto-options';
        cryptoOptions.className = 'crypto-options';
        cryptoOptions.innerHTML = `
            <h4>Selecciona una criptomoneda:</h4>
            <div class="crypto-selection">
                <div class="crypto-option">
                    <input type="radio" id="crypto-btc" name="crypto-currency" value="BTC" checked>
                    <label for="crypto-btc">
                        <i class="fab fa-bitcoin"></i>
                        <span>Bitcoin (BTC)</span>
                    </label>
                </div>
                <div class="crypto-option">
                    <input type="radio" id="crypto-eth" name="crypto-currency" value="ETH">
                    <label for="crypto-eth">
                        <i class="fab fa-ethereum"></i>
                        <span>Ethereum (ETH)</span>
                    </label>
                </div>
                <div class="crypto-option">
                    <input type="radio" id="crypto-usdt" name="crypto-currency" value="USDT">
                    <label for="crypto-usdt">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Tether (USDT)</span>
                    </label>
                </div>
            </div>
        `;
        
        // Insertar después de la opción Paykassa
        paykassaOption.parentNode.insertBefore(cryptoOptions, paykassaOption.nextSibling);
        
        // Inicialmente oculto
        cryptoOptions.style.display = 'none';
        
        // Mostrar opciones
        cryptoOptions.style.display = 'block';
    }
    
    // Inicializar la visualización correcta del método de pago seleccionado
    const initialMethod = document.querySelector('input[name="payment-method"]:checked');
    if (initialMethod) {
        // Disparar el evento change para el método inicialmente seleccionado
        const event = new Event('change');
        initialMethod.dispatchEvent(event);
    }
    
    // Manejar el envío del formulario
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            
            // Procesar el pago según el método seleccionado
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            // Crear el objeto de pedido
            const orderData = {
                id: generateOrderId(),
                date: new Date().toISOString(),
                customer: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                shipping: {
                    address: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postalCode: formData.get('postal-code'),
                    country: formData.get('country')
                },
                items: cart,
                payment: {
                    method: paymentMethod,
                    // Otros detalles de pago aquí
                },
                // Calcular totales
                subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.10,
                // Otros cálculos como descuentos, etc.
            };
            
            // Guardar el pedido en localStorage
            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            
            // Procesar según el método de pago
            if (paymentMethod === 'paykassa') {
                processPayKassaPayment();
            } else if (paymentMethod === 'card') {
                processCardPayment();
            } else if (paymentMethod === 'bank-transfer') {
                // Redirigir a página de transferencia bancaria
                window.location.href = 'bank-transfer.html';
            }
        });
    }
    
    // Configurar la opción "Usar la misma dirección para facturación"
    const billingSameCheckbox = document.getElementById('billing-same');
    if (billingSameCheckbox) {
        billingSameCheckbox.addEventListener('change', function() {
            // Aquí puedes añadir lógica para mostrar/ocultar campos de facturación
        });
    }
    
    // Agregar estilos para overlay de procesamiento
    const style = document.createElement('style');
    style.textContent = `
    .processing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .processing-content {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
    }

    .spinner {
        border: 4px solid rgba(0,0,0,0.1);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);
    
    // Aplicar formato a los campos de tarjeta
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            if (value.length > 19) {
                value = value.substring(0, 19);
            }
            this.value = value;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                if (value.length > 5) {
                    value = value.substring(0, 5);
                }
            }
            this.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            this.value = value;
        });
    }
    
    // Cargar productos del carrito en el resumen
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const summaryItemsContainer = document.querySelector('.summary-items');
        
        if (!summaryItemsContainer) return;
        
        // Limpiar contenedor
        summaryItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            summaryItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
            return;
        }
        
        // Calcular totales
        let subtotal = 0;
        
        // Añadir productos al resumen
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="item-img">
                    <img src="../images/${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">Cantidad: ${item.quantity}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            
            summaryItemsContainer.appendChild(itemElement);
        });
        
        // Actualizar totales en el resumen
        updateOrderSummary(subtotal);
    }
    
    // Actualizar los totales del resumen de pedido
    function updateOrderSummary(subtotal) {
        const summaryRows = document.querySelectorAll('.summary-row');
        
        if (!summaryRows.length) return;
        
        // Calcular impuestos (10% del subtotal)
        const tax = subtotal * 0.10;
        
        // Obtener descuento aplicado (si existe)
        let discount = 0;
        const discountElement = document.querySelector('.summary-row.discount .value');
        if (discountElement) {
            discount = parseFloat(discountElement.textContent.replace('$', '')) || 0;
        }
        
        // Calcular total
        const total = subtotal + tax - Math.abs(discount);
        
        // Actualizar valores en el resumen
        summaryRows.forEach(row => {
            if (row.querySelector('span:first-child').textContent === 'Subtotal') {
                row.querySelector('span:last-child').textContent = `$${subtotal.toFixed(2)}`;
            }
            if (row.querySelector('span:first-child').textContent === 'Impuestos') {
                row.querySelector('span:last-child').textContent = `$${tax.toFixed(2)}`;
            }
            if (row.classList.contains('total')) {
                row.querySelector('span:last-child').textContent = `$${total.toFixed(2)}`;
            }
        });
    }
    
    // Manejar el evento de clic en botón de finalizar compra
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validar el formulario
            if (!validateCheckoutForm()) {
                return;
            }
            
            // Verificar qué método de pago está seleccionado
            const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
            
            if (!selectedPaymentMethod) {
                showError('Por favor, selecciona un método de pago');
                return;
            }
            
            if (selectedPaymentMethod.id === 'paykassa') {
                processPayKassaPayment();
            } else if (selectedPaymentMethod.id === 'bank-transfer') {
                processBankTransferPayment();
            }
        });
    }
    
    // Función para validar el formulario
    function validateCheckoutForm() {
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markInvalid(field, 'Este campo es obligatorio');
                isValid = false;
            } else {
                markValid(field);
            }
        });
        
        // Validar email con expresión regular
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            markInvalid(emailField, 'Email inválido');
            isValid = false;
        }
        
        // Validar número de teléfono
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
            markInvalid(phoneField, 'Teléfono inválido');
            isValid = false;
        }
        
        if (!isValid) {
            showError('Por favor, completa correctamente todos los campos obligatorios');
        }
        
        return isValid;
    }
    
    // Función para procesar pago con PayKassa
    function processPayKassaPayment() {
        // Mostrar overlay de procesamiento
        showProcessingOverlay();
        
        // Obtener datos del formulario
        const formData = new FormData(checkoutForm);
        
        // Obtener datos del carrito desde localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calcular el total del carrito
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Calcular impuestos (10% del subtotal)
        const tax = subtotal * 0.10;
        
        // Aplicar descuento (si existe)
        let discount = 0;
        const discountElement = document.querySelector('.summary-row.discount .value');
        if (discountElement) {
            const discountText = discountElement.textContent;
            discount = parseFloat(discountText.replace('-$', '').trim()) || 0;
        }
        
        // Calcular total
        const total = subtotal + tax - discount;
        
        // Generar ID de orden único
        const orderId = generateOrderId();
        
        // Usar el merchantId del archivo de configuración
        const merchantId = window.paykassaConfig ? window.paykassaConfig.merchantId : 'f87e10f5-3d44-4235-a069-5f8963fbac1a';
        
        // Construir URL para redirección a PayKassa
        const paykassaUrl = 'https://paykassa.app/sci/index.php';
        const params = new URLSearchParams();
        
        params.append('merchant_id', merchantId);
        params.append('order_id', orderId);
        params.append('amount', total.toFixed(2));
        params.append('currency', 'USD');
        params.append('desc', `Pedido en LuxMarket #${orderId}`);
        
        // Datos del cliente
        params.append('email', formData.get('email'));
        
        // URLs de redirección
        const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.indexOf('/pages/'));
        params.append('success_url', `${baseUrl}/pages/order-success.html`);
        params.append('fail_url', `${baseUrl}/failure.html`);
        
        const paymentUrl = `${paykassaUrl}?${params.toString()}`;
        
        // Guardar datos del pedido en localStorage
        localStorage.setItem('pendingOrder', JSON.stringify({
            id: orderId,
            date: new Date().toISOString(),
            total: total.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount.toFixed(2),
            status: 'pending',
            paymentMethod: 'paykassa',
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postal-code'),
                state: formData.get('state'),
                country: formData.get('country')
            },
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }))
        }));
        
        // Redireccionar a PayKassa después de un breve retraso
        setTimeout(() => {
            console.log('Redirigiendo a PayKassa:', paymentUrl);
            window.location.href = paymentUrl;
        }, 1500);
    }
    
    // Función para procesar pago con transferencia bancaria
    function processBankTransferPayment() {
        // Mostrar overlay de procesamiento
        showProcessingOverlay();
        
        // Código similar al de PayKassa, pero redireccionando a la página de transferencia bancaria
        // Obtener datos del formulario
        const formData = new FormData(checkoutForm);
        
        // Obtener datos del carrito desde localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calcular el total del carrito (igual que en processPayKassaPayment)
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Calcular impuestos (10% del subtotal)
        const tax = subtotal * 0.10;
        
        // Aplicar descuento (si existe)
        let discount = 0;
        const discountElement = document.querySelector('.summary-row.discount .value');
        if (discountElement) {
            const discountText = discountElement.textContent;
            discount = parseFloat(discountText.replace('-$', '').trim()) || 0;
        }
        
        // Calcular total
        const total = subtotal + tax - discount;
        
        // Generar ID de orden único
        const orderId = generateOrderId();
        
        // Guardar datos del pedido en localStorage (similar a PayKassa pero con método de pago diferente)
        localStorage.setItem('pendingOrder', JSON.stringify({
            id: orderId,
            date: new Date().toISOString(),
            total: total.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount.toFixed(2),
            status: 'pending',
            paymentMethod: 'bank-transfer',
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postal-code'),
                state: formData.get('state'),
                country: formData.get('country')
            },
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }))
        }));
        
        // Redireccionar a la página de instrucciones de transferencia bancaria
        setTimeout(() => {
            window.location.href = 'bank-transfer-instructions.html';
        }, 1500);
    }
    
    // Función para pagar con Paykassa directo
    async function pagarConPaykassaDirecto(orderData) {
        try {
            const response = await fetch('/api/paykassa-create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();

            if (data.success && data.data) {
                // Muestra los datos de pago en tu página
                mostrarDatosDePago(data.data);
            } else {
                alert(data.error || 'No se pudo crear la factura.');
            }
        } catch (error) {
            alert('Error al conectar con el servidor.');
        }
    }

    function mostrarDatosDePago(datos) {
        // Ejemplo: muestra dirección, QR, monto, etc.
        document.getElementById('payment-info').innerHTML = `
            <h3>Realiza tu pago</h3>
            <p>Monto: ${datos.amount} ${datos.currency}</p>
            <p>Dirección: ${datos.wallet}</p>
            <img src="${datos.qr}" alt="QR de pago">
            <p>Cuando se confirme el pago, recibirás la confirmación automáticamente.</p>
        `;
    }
    
    // Funciones auxiliares
    function generateOrderId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }
    
    function showProcessingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-content">
                <div class="spinner"></div>
                <h3>Procesando tu pedido...</h3>
                <p>Por favor, espera un momento...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    function isValidEmail(email) {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        // Validación simple: al menos 7 dígitos
        return /^\+?[0-9]{7,}$/.test(phone.replace(/[\s\-()]/g, ''));
    }
    
    function markInvalid(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        // Buscar o crear mensaje de error
        let errorMessage = input.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            input.insertAdjacentElement('afterend', errorMessage);
        }
        errorMessage.textContent = message;
    }
    
    function markValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        // Eliminar mensaje de error si existe
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function showError(message) {
        // Crear contenedor de error si no existe
        let errorContainer = document.querySelector('.form-error-container');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-error-container';
            
            // Insertar antes del grupo de botones
            const formActions = document.querySelector('.form-actions');
            if (formActions) {
                formActions.parentNode.insertBefore(errorContainer, formActions);
            }
        }
        
        // Mostrar mensaje de error
        errorContainer.innerHTML = `
            <div class="error-alert">
                <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
        `;
        
        // Desplazarse al mensaje de error
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Inicializar al cargar la página
    loadCartItems();
});