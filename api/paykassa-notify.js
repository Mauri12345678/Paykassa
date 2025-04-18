export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Aquí Paykassa enviará los datos de la notificación
    const notification = req.body;

    // Puedes hacer validaciones aquí, por ejemplo:
    // - Verificar la firma (si Paykassa la envía)
    // - Comprobar el estado del pago
    // - Actualizar tu base de datos, enviar email, etc.

    console.log('Notificación recibida de Paykassa:', notification);

    // Siempre responde con "OK" para que Paykassa sepa que recibiste la notificación
    res.status(200).send('OK');
}