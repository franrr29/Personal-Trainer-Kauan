import { Router } from "express";
import { roleMiddleware } from "../../middlewares/roleMiddle";
import { authMiddleware } from "../../middlewares/auth.middle";
import * as controller from "./routines.controller";


const router = Router();

//rotas de rotinas protegidas com authMiddleware e roleMiddleware para verificar se o user e um treinador
router.post("/", authMiddleware, roleMiddleware(["trainer"]), controller.createRoutine);
router.get("/student/:studentId", authMiddleware, roleMiddleware(["trainer"]), controller.getRoutinesByStudentId);
router.get("/routine/:routineId", authMiddleware, roleMiddleware(["trainer"]), controller.getRoutineById);
router.get('/my-routines', authMiddleware, roleMiddleware(['student']), controller.getMyRoutines);
router.patch("/:routineId", authMiddleware, roleMiddleware(["trainer"]), controller.updateRoutine);
router.delete("/:routineId", authMiddleware, roleMiddleware(["trainer"]), controller.deleteRoutine);

export default router;