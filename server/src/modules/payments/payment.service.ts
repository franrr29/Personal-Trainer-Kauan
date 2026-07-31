import { db } from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Payment } from 'mercadopago';
import client from '../../config/mercadoPago';

const payment = new Payment(client);


//criar um pagamento por parte do trainador e guardar o id do pagamento do mercado pago na db:
export async function createPaymentService(studentId: number, amount: number, plan: string, trainerId: number) {

    const [rows] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ? AND trainer_id = ?", 
        [studentId, trainerId]
    );

    if (rows.length === 0) {
        throw new Error("Student not found or does not belong to the trainer");
    }

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO payments (user_id, amount, plan) VALUES (?, ?, ?)", 
        [studentId, amount, plan]
    );

    const mpPayment = await payment.create({
        body: {
            transaction_amount: amount,
            description: plan,
            payment_method_id: 'pix',
            payer: {
                email: (rows[0] as any).email,
            },
        }
    });

    // guardar el id de mp en la db
    await db.execute(
        "UPDATE payments SET mp_payment_id = ? WHERE id = ?", 
        [String(mpPayment.id), result.insertId]
    );

    return mpPayment;
}


//funcao para pegar todos os pagamentos de um aluno pelo id do aluno e do treinador:
export async function getPaymentsByStudentIdService(studentId: number, trainerId: number): Promise<any[]> {

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ? AND trainer_id = ?", [studentId, trainerId]);

    if (rows.length === 0) {
        throw new Error("No payments found for this student or student does not belong to the trainer");
    }

    const payments= await db.execute<RowDataPacket[]>("SELECT * FROM payments WHERE user_id = ?", [studentId]);


    return payments[0] as any[];
}



//funcao para pegar um pagamento pelo id do pagamento e do treinador:
export async function getPaymentByIdService(paymentId: number, trainerId: number): Promise<any> {

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM payments WHERE id = ? AND user_id IN (SELECT id FROM users WHERE trainer_id = ?)", [paymentId, trainerId]);

    if (rows.length === 0) {
        throw new Error("Payment not found or does not belong to the trainer");
    }

    const payment = rows[0] as any;
    return payment;

}


//funcao para criar um pagamento publico sem precisar de login, para o aluno pagar o plano:
export async function createPublicPayment(name: string, email: string, phone: string, plan: string, amount: number, trainer_id: number) {
    // guardar o pagamento na db do aluno sem id ainda:
    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO payments (name, email, phone, plan, amount, trainer_id) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, phone, plan, amount, trainer_id]
    );

    // gerar pago pix em mercado pago
    const payment = new Payment(client);
    const mpPayment = await payment.create({
        body: {
            transaction_amount: amount,
            description: plan,
            payment_method_id: 'pix',
            payer: { email },
        }
    });

    // Salvar o id do pagamento do mercado pago na db
    await db.execute(
        "UPDATE payments SET mp_payment_id = ? WHERE id = ?",
        [String(mpPayment.id), result.insertId]
    );

    return {
        qr_code: mpPayment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: mpPayment.point_of_interaction?.transaction_data?.qr_code_base64,
        payment_id: result.insertId,
    };
}