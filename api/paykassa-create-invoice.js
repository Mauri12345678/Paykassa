// Al inicio del archivo, solo si fetch no está disponible globalmente
// import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { amount, currency, order_id, payment_system, email } = req.body;

    // Validación básica
    if (!amount || !currency || !order_id || !payment_system || !email) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const payload = {
        shop_id: process.env.PAYKASSA_SHOP_ID,
        api_key: process.env.PAYKASSA_SECRET_KEY,
        amount,
        currency,
        order_id,
        system: payment_system,
        comment: `Pedido: ${order_id}`,
        email,
    };

    try {
        const response = await fetch('https://api.paykassa.pro/v1/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.success) {
            return res.status(400).json({ error: data.message || 'Error en Paykassa' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear factura en Paykassa' });
    }
}