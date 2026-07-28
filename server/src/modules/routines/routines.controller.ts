import { Request, Response, NextFunction } from "express";
import * as service from "./routines.service";



//funcao para criar uma nova rotina:
export async function createRoutine(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
       
        const { student_id, day, title, trainer_note } = req.body;

        const newRoutine = await service.createRoutineService(student_id, day, title, trainer_note, userId);
        res.status(201).json(newRoutine);

    } catch (error) {
        next(error);
    }
}


//funcao para obter todas as rotinas de um estudante:
export async function getRoutinesByStudentId(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const studentId = Number(req.params.studentId);

        const routines = await service.getRoutinesByStudentIdService(studentId, userId);
        res.status(200).json(routines);

    } catch (error) {

        next(error);
    }
}


//funcao para obter uma rotina pelo id:
export async function getRoutineById(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const routineId = Number(req.params.routineId);

        const routine = await service.getRoutineByIdService(routineId, userId);
        res.status(200).json(routine);

    } catch (error) {
        next(error);
    }
}

//atualizar uma rotina existente:
export async function updateRoutine(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const routineId = Number(req.params.routineId);
        const { day, title, trainer_note } = req.body;

        const updatedRoutine = await service.updateRoutineService(routineId, { day, title, trainer_note }, userId);        res.status(200).json(updatedRoutine);

    } catch (error) {
        next(error);
    }
}

//apagar uma rotina existente:
export async function deleteRoutine(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const routineId = Number(req.params.routineId);
        await service.deleteRoutineService(routineId, userId);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
}