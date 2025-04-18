// Configuración de PayKassa
const paykassaConfig = {
    merchantId: 'f87e10f5-3d44-4235-a069-5f8963fbac1a', // Tu ID de comerciante
    // No incluir la API key en el frontend por seguridad
};

// Exponer la configuración
window.paykassaConfig = paykassaConfig;