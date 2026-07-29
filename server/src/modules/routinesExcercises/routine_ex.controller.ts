import { Response, Request, NextFunction } from 'express';
import { addExerciseToRoutineService, getExercisesByRoutineIdService, updateExerciseInRoutineService, deleteExerciseFromRoutineService } from './routine_ex.service';



//colocar exercício na rotina
export async function addExerciseToRoutine(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const { routineId, exerciseId, sets, reps, notes, exercise_order } = req.body;

        const addedExercise = await addExerciseToRoutineService({routineId, exerciseId, sets, reps, notes, exercise_order},userId);

        return res.status(201).json(addedExercise);

    } catch (error) {

        next(error);
    }
}


//pegar exercícios de uma rotina
export async function getExercisesByRoutineId(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const { routineId } = req.params;
        
        const exercises = await getExercisesByRoutineIdService(Number(routineId), userId);

        return res.status(200).json(exercises);

    } catch (error) {

        next(error);
    }  
}


//atualizar exercício em uma rotina
export async function updateExerciseInRoutine(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { routineId, exerciseId } = req.params;
        const { sets, reps, notes, exercise_order } = req.body;

        const updatedExercise = await updateExerciseInRoutineService(Number(routineId), Number(exerciseId), { sets, reps, notes, exercise_order }, userId);

        return res.status(200).json(updatedExercise);
    } catch (error) {
        next(error);
    }
}


//apagar um exercício de uma rotina
export async function deleteExerciseFromRoutine(req: Request, res: Response, next: NextFunction) {

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const { routineId, exerciseId } = req.params;

        const deletedExercise = await deleteExerciseFromRoutineService(Number(routineId), Number(exerciseId), userId);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}   