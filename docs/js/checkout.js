document.addEventListener('DOMContentLoaded', function() {
    // Carga los datos del carrito en checkout
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = document.getElementById('order-summary');
    
    // IMPORTANTE: Define checkoutForm al inicio de tu script
    const checkoutForm = document.getElementById('checkout-form');
    
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
            console.log("Formulario enviado");
            
            if (!validateCheckoutForm()) {
                console.log("Validación fallida");
                return;
            }
            console.log("Validación exitosa");
            
            // Resto de tu código...
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
    // if (checkoutButton) {
    //     checkoutButton.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         ...
    //     });
    // }
    
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
    async function processPayKassaPayment() {
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
        
        // Determinar qué criptomoneda se seleccionó
        const cryptoSelected = document.querySelector('input[name="crypto-currency"]:checked');
        const paymentSystem = cryptoSelected ? cryptoSelected.value.toLowerCase() : 'bitcoin';
        
        // En lugar de redireccionar, llamar a tu API
        try {
            // Ocultar el formulario para mostrar el pago
            checkoutForm.style.display = 'none';
            
            const response = await fetch('/api/paykassa-create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total.toFixed(2),
                    currency: 'USD',
                    order_id: orderId,
                    payment_system: paymentSystem,
                    email: formData.get('email')
                })
            });
            
            // Eliminar overlay de procesamiento
            document.querySelector('.processing-overlay').remove();
            
            const data = await response.json();
            
            if (data.success) {
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
                
                // Mostrar la información de pago en la página actual
                const paymentInfoContainer = document.getElementById('payment-info');
                paymentInfoContainer.style.display = 'block';
                mostrarDatosDePago(data.data);
                
                // Desplazar a la información de pago
                paymentInfoContainer.scrollIntoView({ behavior: 'smooth' });
                
            } else {
                // Volver a mostrar el formulario en caso de error
                checkoutForm.style.display = 'block';
                showError('Error al crear la factura de pago: ' + data.error);
            }
        } catch (error) {
            // Volver a mostrar el formulario en caso de error
            checkoutForm.style.display = 'block';
            document.querySelector('.processing-overlay').remove();
            showError('Error al conectar con el servidor: ' + error.message);
        }
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
        const paymentInfo = document.getElementById('payment-info');
        
        if (!paymentInfo) {
            console.error('No se encontró el contenedor para la información de pago');
            return;
        }
        
        // Estilo visual para la información de pago
        paymentInfo.innerHTML = `
            <div class="payment-confirmation">
                <div class="payment-header">
                    <i class="fas fa-wallet"></i>
                    <h2>Realiza tu pago en criptomoneda</h2>
                </div>
                
                <div class="payment-details">
                    <div class="payment-qr">
                        <img src="${datos.qr_code || datos.qr}" alt="Código QR para pago">
                    </div>
                    
                    <div class="payment-instructions">
                        <div class="payment-amount">
                            <span>Monto exacto a pagar:</span>
                            <strong>${datos.amount} ${datos.currency}</strong>
                        </div>
                        
                        <div class="payment-address">
                            <span>Dirección de pago:</span>
                            <div class="copy-field">
                                <input type="text" readonly value="${datos.wallet}" id="wallet-address">
                                <button type="button" class="btn-copy" onclick="copyToClipboard('wallet-address')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="payment-time">
                            <span>Tiempo de espera:</span>
                            <strong>30 minutos</strong>
                        </div>
                        
                        <div class="payment-status">
                            <div class="status-icon pending">
                                <i class="fas fa-clock"></i>
                            </div>
                            <span>Esperando confirmación de pago</span>
                        </div>
                    </div>
                </div>
                
                <div class="payment-notes">
                    <p><i class="fas fa-info-circle"></i> Envía exactamente la cantidad indicada a la dirección mostrada.</p>
                    <p><i class="fas fa-shield-alt"></i> Tu pedido será procesado automáticamente una vez confirmada la transacción.</p>
                </div>
                
                <div class="payment-help">
                    <h4>¿Necesitas ayuda?</h4>
                    <p>Si tienes problemas con tu pago, contáctanos incluyendo el ID de tu orden: <strong>${datos.order_id}</strong></p>
                </div>
            </div>
        `;
        
        // Añadir la función para copiar al portapapeles
        window.copyToClipboard = function(elementId) {
            const element = document.getElementById(elementId);
            element.select();
            document.execCommand('copy');
            
            // Mostrar un mensaje de "copiado"
            const copyButton = element.nextElementSibling;
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = originalHTML;
            }, 2000);
        };
        
        // Comprobar estado de pago cada 30 segundos
        checkPaymentStatus(datos.order_id);
    }

    // Función para comprobar el estado del pago
    function checkPaymentStatus(orderId) {
        const statusCheck = setInterval(async () => {
            try {
                const response = await fetch(`/api/paykassa-transaction-notify?order_id=${orderId}`);
                const data = await response.json();
                
                if (data.status === 'completed') {
                    // Actualizar UI para mostrar pago completado
                    document.querySelector('.payment-status').innerHTML = `
                        <div class="status-icon completed">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <span>¡Pago confirmado!</span>
                    `;
                    
                    // Redireccionar a la página de éxito después de un momento
                    setTimeout(() => {
                        window.location.href = 'order-success.html';
                    }, 3000);
                    
                    // Limpiar intervalo
                    clearInterval(statusCheck);
                }
            } catch (error) {
                console.log('Error al comprobar estado de pago:', error);
            }
        }, 30000); // Comprobar cada 30 segundos
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