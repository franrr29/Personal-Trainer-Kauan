import { Request, Response, NextFunction } from 'express';
import * as ExerciseService from './exercise.service';
//obter todos os excercicios:
export async function getAll(req: Request, res: Response, next: NextFunction) {
    
    const { userId } = req;

    try {
        const exercises = await ExerciseService.getAllExercises(userId);
        res.status(200).json(exercises);

    } catch (error) {
        next(error);
    }

}

//obter um excercicio pelo id:
export async function getById(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;
    const id = Number(req.params.id);

    try {
        const exercise = await ExerciseService.getExerciseById(id, userId);
        res.status(200).json(exercise);
    } catch (error) {
        next(error);
    }
}


//crear um excercicio:
export async function create(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;
    const exerciseData = req.body;

    try {

        const newExercise = await ExerciseService.createExercise(exerciseData, userId);
        res.status(201).json(newExercise);

    } catch (error) {
        next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;
    const id = Number(req.params.id);
    const exerciseData = req.body;

    try {
        
        const updateExcercise = await ExerciseService.updateExercise(id, exerciseData, userId);
        res.status(200).json(updateExcercise);

    } catch (error) {
        next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction    ) {

    const { userId } = req;
    const id = Number(req.params.id);

    try {

        const deleteExcercise = await ExerciseService.deleteExercise(id, userId);
        res.status(200).json(deleteExcercise);

    } catch (error) {
        next(error);
    }
}
