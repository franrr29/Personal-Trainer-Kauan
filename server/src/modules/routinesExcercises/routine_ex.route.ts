import { Router } from "express";
import { addExerciseToRoutine, getExercisesByRoutineId, updateExerciseInRoutine, deleteExerciseFromRoutine } from "./routine_ex.controller";
import { authMiddleware } from "../../middlewares/auth.middle";
import { roleMiddleware } from "../../middlewares/roleMiddle";


const router = Router();

//adicionar um exercicio a uma rotina
router.post("/add", authMiddleware, roleMiddleware(["trainer"]), addExerciseToRoutine);

//pegar exercicios de uma rotina
router.get("/:routineId", authMiddleware, roleMiddleware(["trainer"]), getExercisesByRoutineId);

//atualizar um exercicio de uma rotina
router.put("/:id", authMiddleware, roleMiddleware(["trainer"]), updateExerciseInRoutine);

//apagar um exercicio de uma rotina
router.delete("/:routineId/:exerciseId", authMiddleware, roleMiddleware(["trainer"]), deleteExerciseFromRoutine);

export default router;