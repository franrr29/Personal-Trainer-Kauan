import { db } from '../../config/db';
import { createHmac } from 'crypto';
import { Payment } from 'mercadopago';
import client from '../../config/mercadoPago';

export async function paymentNotificationService(paymentId: string, xSignature: string, xRequestId: string) {

    // separar ts y v1 del header x-signature
    const parts = xSignature.split(',');
    const ts = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1];
    const v1 = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1];

    // armar el string y calcular el hmac
    const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
    const secret = process.env.MP_WEBHOOK_SECRET || '';
    const hash = createHmac('sha256', secret).update(manifest).digest('hex');

    // comparar firma
    if (hash !== v1) {
        throw new Error('Invalid webhook signature');
    }

    // consultar el pago real a la api de mp
    const payment = new Payment(client);
    const mpPayment = await payment.get({ id: paymentId });

    if (mpPayment.status !== 'approved') {
        return { status: mpPayment.status };
    }

    // actualizar pago y activar alumno
    const [updatePayment] = await db.query(
        'UPDATE payments SET status = ? WHERE mp_payment_id = ?',
        ['approved', paymentId]
    );

    const [activateStudent] = await db.query(
        'UPDATE users SET status = ? WHERE id = (SELECT student_id FROM payments WHERE mp_payment_id = ?)',
        ['active', paymentId]
    );

    return { status: 'approved' };
}