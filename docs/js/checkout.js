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
            console.log("Procesando método de pago...");
            
            // Verificar qué método de pago está seleccionado
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
            
            if (!paymentMethod) {
                showError('Por favor, selecciona un método de pago');
                return;
            }
            
            // Procesar según el método de pago
            switch(paymentMethod.value) {
                case 'paypal':
                    processPayPalPayment();
                    break;
                case 'card':
                    // Cambia esta línea para probar con API o sin API
                    processCardPayment(); // Versión simulada
                    // processCardPaymentAPI(); // Versión con API real
                    break;
                case 'bank-transfer':
                    processBankTransferPayment();
                    break;
                case 'paykassa':
                    processPayKassaPayment(); // Añade esta línea
                    break;
                default:
                    showError('Método de pago no válido');
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
        
        try {
            // Calcular total
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = 0;
            cart.forEach(item => subtotal += item.price * item.quantity);
            const tax = subtotal * 0.10;
            let discount = 0;
            const total = subtotal + tax - discount; // Define total aquí
            
            // Obtener datos del formulario y carrito
            const formData = new FormData(checkoutForm);
            
            // Simulación para desarrollo local (evita el error 404)
            // En producción, esto usaría tu API real
            const isLocalDevelopment = window.location.hostname === 'localhost' || 
                                       window.location.hostname === '127.0.0.1';
            
            // Datos de compra para localStorage
            const orderId = generateOrderId();
            const orderData = {
                id: orderId,
                date: new Date().toISOString(),
                total: total.toFixed(2),
                items: cart
                // ... otros datos de la orden
            };
            
            // Guardar datos del pedido
            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            
            if (isLocalDevelopment) {
                // Para desarrollo local: simular respuesta de PayKassa
                setTimeout(() => {
                    // Quitar overlay
                    document.querySelector('.processing-overlay').remove();
                    
                    // Ocultar formulario
                    checkoutForm.style.display = 'none';
                    
                    // Mostrar datos de pago simulados
                    const paymentInfoContainer = document.getElementById('payment-info');
                    if (paymentInfoContainer) {
                        paymentInfoContainer.style.display = 'block';
                        
                        // Datos simulados para pruebas
                        mostrarDatosDePago({
                            qr_code: 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                            wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                            amount: total.toFixed(8),
                            currency: 'BTC',
                            order_id: orderId
                        });
                        
                        // Desplazar a la información de pago
                        paymentInfoContainer.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        console.error('No se encontró el contenedor de información de pago');
                    }
                }, 1500);
            } else {
                // Para producción: hacer la petición real a la API
                const response = await fetch('/api/paykassa-create-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: total.toFixed(2),
                        currency: 'USD',
                        order_id: orderId,
                        payment_system: 'bitcoin',
                        email: formData.get('email')
                    })
                });
                
                // Eliminar overlay
                document.querySelector('.processing-overlay').remove();
                
                const data = await response.json();
                
                if (data.success) {
                    // Ocultar formulario
                    checkoutForm.style.display = 'none';
                    
                    // Mostrar información de pago
                    const paymentInfoContainer = document.getElementById('payment-info');
                    paymentInfoContainer.style.display = 'block';
                    mostrarDatosDePago(data.data);
                    paymentInfoContainer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Volver a mostrar el formulario en caso de error
                    checkoutForm.style.display = 'block';
                    showError('Error al crear la factura de pago: ' + data.error);
                }
            }
        } catch (error) {
            // Volver a mostrar el formulario en caso de error
            checkoutForm.style.display = 'block';
            document.querySelector('.processing-overlay')?.remove();
            showError('Error al conectar con el servidor: ' + error.message);
        }
    }
    
    // Función para procesar pagos con tarjeta usando API
    async function processCardPaymentAPI() {
        showProcessingOverlay();
        
        try {
            // Obtener datos del formulario
            const formData = new FormData(checkoutForm);
            
            // Crear datos de la orden
            const orderId = generateOrderId();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = 0;
            cart.forEach(item => subtotal += item.price * item.quantity);
            const tax = subtotal * 0.10;
            const total = subtotal + tax;
            
            // Llamar a tu API de procesamiento de pagos
            const response = await fetch('/api/process-card-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total.toFixed(2),
                    currency: 'USD',
                    order_id: orderId,
                    card_number: formData.get('card-number').replace(/\s/g, ''),
                    expiry_date: formData.get('expiry-date'),
                    cvv: formData.get('cvv'),
                    name: formData.get('name'),
                    email: formData.get('email')
                })
            });
            
            const data = await response.json();
            
            // Guardar datos del pedido
            localStorage.setItem('pendingOrder', JSON.stringify({
                id: orderId,
                date: new Date().toISOString(),
                total: total.toFixed(2),
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                status: data.success ? 'completed' : 'failed',
                paymentMethod: 'card',
                customer: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                items: cart
            }));
            
            // Eliminar overlay
            document.querySelector('.processing-overlay').remove();
            
            if (data.success) {
                // Redirigir a página de éxito
                window.location.href = 'success.html';
            } else {
                // Mostrar error
                showError('Error en el pago: ' + (data.message || 'Intente nuevamente'));
            }
        } catch (error) {
            document.querySelector('.processing-overlay')?.remove();
            showError('Error en la conexión: ' + error.message);
        }
    }
    
    // Función para procesar pagos con PayPal
    function processPayPalPayment() {
        showProcessingOverlay();
        
        setTimeout(() => {
            // Simulación para desarrollo
            const orderId = generateOrderId();
            const total = calculateTotal();
            
            // Redirigir a PayPal
            const paypalForm = document.createElement('form');
            paypalForm.method = 'post';
            paypalForm.action = 'https://www.paypal.com/cgi-bin/webscr';
            paypalForm.innerHTML = `
                <input type="hidden" name="cmd" value="_xclick">
                <input type="hidden" name="business" value="tu_correo_paypal@example.com">
                <input type="hidden" name="item_name" value="Pedido ${orderId}">
                <input type="hidden" name="amount" value="${total.toFixed(2)}">
                <input type="hidden" name="currency_code" value="USD">
                <input type="hidden" name="return" value="${window.location.origin}/success.html">
                <input type="hidden" name="cancel_return" value="${window.location.origin}/checkout.html">
            `;
            
            document.body.appendChild(paypalForm);
            paypalForm.submit();
        }, 1500);
    }
    
    // Función para procesar transferencias bancarias
    function processBankTransferPayment() {
        // Mostrar overlay de procesamiento
        showProcessingOverlay();
        
        setTimeout(() => {
            // Obtener datos del formulario
            const formData = new FormData(checkoutForm);
            
            // Crear datos de la orden
            const orderId = generateOrderId();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = 0;
            cart.forEach(item => subtotal += item.price * item.quantity);
            const tax = subtotal * 0.10;
            const total = subtotal + tax;
            
            // Guardar datos del pedido
            localStorage.setItem('pendingOrder', JSON.stringify({
                id: orderId,
                date: new Date().toISOString(),
                total: total.toFixed(2),
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
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
                items: cart
            }));
            
            // Mostrar instrucciones de transferencia
            document.querySelector('.processing-overlay').remove();
            checkoutForm.style.display = 'none';
            
            const paymentInfo = document.getElementById('payment-info');
            if (paymentInfo) {
                paymentInfo.style.display = 'block';
                paymentInfo.innerHTML = `
                    <div class="payment-confirmation">
                        <div class="payment-header">
                            <i class="fas fa-university"></i>
                            <h2>Instrucciones para transferencia bancaria</h2>
                        </div>
                        
                        <div class="bank-details">
                            <p>Por favor, realiza una transferencia bancaria con los siguientes datos:</p>
                            
                            <div class="bank-info">
                                <div class="bank-row">
                                    <span>Banco:</span>
                                    <strong>Banco Internacional</strong>
                                </div>
                                <div class="bank-row">
                                    <span>Beneficiario:</span>
                                    <strong>LuxMarket Inc.</strong>
                                </div>
                                <div class="bank-row">
                                    <span>Cuenta:</span>
                                    <strong>ES12 3456 7890 1234 5678 9012</strong>
                                </div>
                                <div class="bank-row">
                                    <span>Concepto:</span>
                                    <strong>Pedido ${orderId}</strong>
                                </div>
                                <div class="bank-row">
                                    <span>Importe:</span>
                                    <strong>$${total.toFixed(2)}</strong>
                                </div>
                            </div>
                            
                            <div class="bank-note">
                                <p><i class="fas fa-info-circle"></i> Una vez realices la transferencia, tu pedido será procesado en 24-48 horas.</p>
                                <p><i class="fas fa-envelope"></i> Recibirás un email de confirmación cuando recibamos tu pago.</p>
                            </div>
                            
                            <div class="bank-actions">
                                <a href="order-tracking.html" class="btn btn-primary">
                                    <i class="fas fa-search"></i> Seguimiento del pedido
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }
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
        
        console.log("Mostrando datos de pago:", datos);
        
        // Estilo visual para la información de pago
        paymentInfo.innerHTML = `
            <div class="payment-confirmation">
                <div class="payment-header">
                    <i class="fas fa-wallet"></i>
                    <h2>Realiza tu pago en criptomoneda</h2>
                </div>
                
                <div class="payment-details">
                    <div class="payment-qr">
                        <img src="${datos.qr_code}" alt="Código QR para pago">
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
                    </div>
                </div>
            </div>
        `;
        
        // Función para copiar al portapapeles
        window.copyToClipboard = function(elementId) {
            const element = document.getElementById(elementId);
            element.select();
            document.execCommand('copy');
            alert('¡Copiado al portapapeles!');
        };
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
                        window.location.href = 'success.html';
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