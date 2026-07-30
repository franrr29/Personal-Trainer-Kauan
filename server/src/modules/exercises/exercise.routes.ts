import { Router } from 'express';
import { roleMiddleware } from '../../middlewares/roleMiddle';
import { authMiddleware } from '../../middlewares/auth.middle';
import { validateBody } from '../../middlewares/validation';
import * as controller from './exercise.controller';
import { exerciseSchema } from '../../types/excercises';

const router = Router();


//rutas de ejercicios protegidas com authMiddleware e roleMiddleware para verificar se o user e um treinador
router.get("/", authMiddleware, roleMiddleware(["trainer"]), controller.getAll);
router.get("/:id", authMiddleware, roleMiddleware(["trainer"]), controller.getById);
router.post("/", authMiddleware, roleMiddleware(["trainer"]), validateBody(exerciseSchema), controller.create);
router.patch("/:id", authMiddleware, roleMiddleware(["trainer"]), validateBody(exerciseSchema), controller.update);
router.delete("/:id", authMiddleware, roleMiddleware(["trainer"]), controller.remove);

export default router;