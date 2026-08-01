import { Router } from 'express';
import { createPlan, getPlans, updatePlan, deletePlan, getPublicPlans } from './plans.controller';
import { authMiddleware } from '../../middlewares/auth.middle';
import { roleMiddleware } from '../../middlewares/roleMiddle';


const router = Router();

//ruta geral sem middle ware para trazer os planos publicos de um treinador
router.get('/public/:trainerId', getPublicPlans);
router.post('/', authMiddleware, roleMiddleware(['trainer']), createPlan);
router.get('/', authMiddleware, roleMiddleware(['trainer']), getPlans);
router.put('/:id', authMiddleware, roleMiddleware(['trainer']), updatePlan);
router.delete('/:id', authMiddleware, roleMiddleware(['trainer']), deletePlan);

export default router;