import { Request, Response } from 'express';
import { paymentNotificationService } from './webHook.service';

//funao para lidar com notificacoes de pagamento do webhook:
export async function handlePaymentNotification(req: Request, res: Response) {

    try {
        const { 'x-signature': xSignature, 'x-request-id': xRequestId } = req.headers;
        const { data: { id: paymentId } } = req.body;

        await paymentNotificationService(paymentId, xSignature as string, xRequestId as string);

        return res.status(200).json({ message: 'Webhook received' });

    } catch (error) {
        console.error('Webhook error:', error);
        //tiro siempre 200 para que mp no reintente y si notificar que se recibio la peticion
        return res.status(200).json({ message: 'Webhook received' });
    }
}