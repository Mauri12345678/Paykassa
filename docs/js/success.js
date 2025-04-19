document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del pedido de localStorage
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder')) || null;
    
    if (!pendingOrder) {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar detalles del pedido
    const orderDetails = document.getElementById('orderDetails');
    if (orderDetails) {
        orderDetails.innerHTML = `
            <div class="detail-row">
                <span>Número de pedido:</span>
                <strong>${pendingOrder.id}</strong>
            </div>
            <div class="detail-row">
                <span>Fecha:</span>
                <strong>${new Date(pendingOrder.date).toLocaleDateString()}</strong>
            </div>
            <div class="detail-row">
                <span>Total:</span>
                <strong>$${pendingOrder.total}</strong>
            </div>
            <div class="detail-row">
                <span>Estado:</span>
                <strong class="status-${pendingOrder.status}">
                    ${pendingOrder.status === 'completed' ? 'Completado' : 'Pendiente'}
                </strong>
            </div>
            <div class="detail-row">
                <span>Método de pago:</span>
                <strong>${getPaymentMethodName(pendingOrder.paymentMethod)}</strong>
            </div>
        `;
    }
    
    // Botón para descargar factura (simulación)
    const downloadBtn = document.getElementById('downloadInvoice');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('La factura será enviada a tu correo electrónico.');
        });
    }
    
    function getPaymentMethodName(method) {
        switch(method) {
            case 'card': return 'Tarjeta de crédito';
            case 'paykassa': return 'Criptomoneda';
            case 'bank-transfer': return 'Transferencia bancaria';
            default: return 'Desconocido';
        }
    }
});