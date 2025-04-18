export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const notification = req.body;
    console.log('Notificación de transacción de Paykassa:', notification);

    res.status(200).send('OK');
}