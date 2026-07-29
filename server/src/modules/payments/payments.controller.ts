import { Response, Request, NextFunction } from 'express';
import { createPaymentService, getPaymentsByStudentIdService, getPaymentByIdService } from './payments.service';

//funcao para criar um pagamento pelo treinador:
export async function createPayment(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { studentId } = req.params;
        const studentIdNumber = Number(studentId);
        const { amount, plan } = req.body;

        const payment = await createPaymentService(studentIdNumber, amount, plan, userId);

        return res.status(201).json({
            message: "Payment created successfully",
            payment
        });

    } catch (error) {

        next(error);
    }
}


//funcao para pegar todos os pagamentos de um aluno pelo:
export async function getPaymentsByStudentId(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { studentId } = req.params;
        const studentIdNumber = Number(studentId);
        const payments = await getPaymentsByStudentIdService(studentIdNumber, userId);

        return res.status(200).json(payments);
    } catch (error) {

        next(error);
    }
}


//funcao para pegar um pagamento pelo id:
export async function getPaymentById(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const { paymentId } = req.params;
        const paymentIdNumber = Number(paymentId);
        const payment = await getPaymentByIdService(paymentIdNumber, userId);

        return res.status(200).json(payment);
    } catch (error) {

        next(error);
    }
}