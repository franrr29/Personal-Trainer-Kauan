import { Router } from 'express';
import { createPlan, getPlans, updatePlan, deletePlan } from './plans.controller';
import { authMiddleware } from '../../middlewares/auth.middle';
import { roleMiddleware } from '../../middlewares/roleMiddle';


const router = Router();

router.post('/', authMiddleware, roleMiddleware(['trainer']), createPlan);
router.get('/', authMiddleware, roleMiddleware(['trainer']), getPlans);
router.put('/:id', authMiddleware, roleMiddleware(['trainer']), updatePlan);
router.delete('/:id', authMiddleware, roleMiddleware(['trainer']), deletePlan);

export default router;