import { db } from '../../config/db';
import { createHmac } from 'crypto';
import { Payment } from 'mercadopago';
import client from '../../config/mercadoPago';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { createNotificationService } from '../notifications/notific.service';


export async function paymentNotificationService(paymentId: string, xSignature: string, xRequestId: string) {

    // separar ts e v1 do header x-signature
    const parts = xSignature.split(',');
    const ts = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1];
    const v1 = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1];

    // montar a string e calcular o hmac
    const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
    const secret = process.env.MP_WEBHOOK_SECRET || '';
    const hash = createHmac('sha256', secret).update(manifest).digest('hex');

    // comparar a assinatura
    if (hash !== v1) {
        throw new Error('Invalid webhook signature');
    }

    // consultar o pagamento real na api do mp
    const payment = new Payment(client);
    const mpPayment = await payment.get({ id: paymentId });

    if (mpPayment.status !== 'approved') {
        return { status: mpPayment.status };
    }

    // buscar dados do aluno e trainer salvos em payments
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT id, name, email, phone, trainer_id FROM payments WHERE mp_payment_id = ?',
        [paymentId]
    );

    if (rows.length === 0) {
        throw new Error('Payment not found in database');
    }

    const { id: localPaymentId, name, email, phone, trainer_id } = rows[0];

    // criar o usuario como student e atribuir ao trainer
    const [userResult] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, phone, role, trainer_id, status) VALUES (?, ?, ?, 'student', ?, 'active')",
        [name, email, phone, trainer_id]
    );

    // atualizar o payment com o user_id e status aprovado
    await db.query(
        'UPDATE payments SET user_id = ?, status = ? WHERE id = ?',
        [userResult.insertId, 'approved', localPaymentId]
    );

    // notificar o trainer que o aluno pagou
    await createNotificationService(trainer_id, `${name} pagou o plano`);

    return { status: 'approved' };
}