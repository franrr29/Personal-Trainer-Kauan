import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middle';
import { roleMiddleware } from '../../middlewares/roleMiddle';
import {getNotifications, markNotificationAsRead} from './notific.controller';
const router = Router();

// Rotas para notific
router.get('/', authMiddleware, roleMiddleware(['trainer']), getNotifications);
router.post('/:id/read', authMiddleware, roleMiddleware(['trainer']), markNotificationAsRead);

export default router;
