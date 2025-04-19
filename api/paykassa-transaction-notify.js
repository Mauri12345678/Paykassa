// Forzar redeploy en Vercel
import PaykassaIntegration from 'paykassa-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Obtén las credenciales desde las variables de entorno (por si quieres validar la firma)
    const SHOP_ID = process.env.PAYKASSA_SHOP_ID;
    const SECRET_KEY = process.env.PAYKASSA_SECRET_KEY;

    // Notificación recibida de Paykassa
    const notification = req.body;
    console.log('Notificación de transacción de Paykassa:', notification);

    // Aquí podrías validar la notificación usando SHOP_ID y SECRET_KEY si Paykassa lo requiere

    // Siempre responde con "OK" para que Paykassa sepa que recibiste la notificación
    res.status(200).send('OK');
}