import { db } from '../../config/db';
import { createHmac } from 'crypto';
import { Payment } from 'mercadopago';
import client from '../../config/mercadoPago';
import { RowDataPacket } from 'mysql2';
import { createNotificationService } from '../notifications/notific.service';

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

    // obtener datos del pago, alumno y trainer 
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT p.student_id, u.name AS student_name, u.trainer_id 
         FROM payments p 
         JOIN users u ON u.id = p.student_id 
         WHERE p.mp_payment_id = ?`,
        [paymentId]
    );

    if (rows.length === 0) {
        throw new Error('Payment not found in database');
    }

    const { student_id, student_name, trainer_id } = rows[0];

    // actualizar pago
    await db.query(
        'UPDATE payments SET status = ? WHERE mp_payment_id = ?',
        ['approved', paymentId]
    );

    // activar alumno
    await db.query(
        'UPDATE users SET status = ? WHERE id = ?',
        ['active', student_id]
    );

    // notificar al trainer
    await createNotificationService(trainer_id, `${student_name} pagou o plano`);

    return { status: 'approved' };
}