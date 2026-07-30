import { Router } from 'express';
import { handlePaymentNotification } from './webHook.controller';
//sin middles ya que es MP que llama al endpoint:

const router = Router();

router.post ('/payment-notification', handlePaymentNotification);

export default router;