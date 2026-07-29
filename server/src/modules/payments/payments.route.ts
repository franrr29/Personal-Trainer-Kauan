import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middle';
import{ roleMiddleware } from '../../middlewares/roleMiddle';
import { createPayment, getPaymentsByStudentId, getPaymentById } from './payments.controller';

const router = Router();

//rota para criar um pagamento pelo treinador:
router.get('/payment/:paymentId', authMiddleware, roleMiddleware(['trainer']), getPaymentById);
router.post('/:studentId', authMiddleware, roleMiddleware(['trainer']), createPayment);
router.get('/:studentId', authMiddleware, roleMiddleware(['trainer']), getPaymentsByStudentId);

export default router;