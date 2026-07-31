import { Request, Response, NextFunction } from 'express';
import { createPlanService, getPlansService, updatePlanService, deletePlanService } from './plans.service';



//criar um plano por parte do treinador:
export async function createPlan(req: Request, res: Response, next: NextFunction) {

    const userId = req.user.id;
    

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized for creating plan' });
    }

    try {

        const { name, description, features, price, duration_value, duration_unit } = req.body;

        const createdPlan= await createPlanService({ name, description, features, price, duration_value, duration_unit, userId });

        return res.status(201).json(createdPlan);

    } catch (error) {

        next(error);
    }
}


//trazer todos os planos do treinador:
export async function getPlans(req: Request, res: Response, next: NextFunction) {

    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized for getting plans' });
    }

    try {

        const plans = await getPlansService(userId);

        return res.status(200).json(plans);

    }catch (error) {
        next(error);
    }
}

//atualizar um plano do treinador:
export async function updatePlan(req: Request, res: Response, next: NextFunction) {

    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized for updating plan' });
    }

    try {

        const { id } = req.params;
        const planId= Number(id);

        const { name, description, features, price, duration_value, duration_unit } = req.body;

        const updatedPlan = await updatePlanService(planId, { name, description, features, price, duration_value, duration_unit }, userId);

        return res.status(200).json(updatedPlan);

    } catch (error) {
        next(error);
    }

}

//apagar um plano do treinador:
export async function deletePlan(req: Request, res: Response, next: NextFunction) {

    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized for deleting plan' });
    }

    try {

        const { id } = req.params;
        const planId = Number(id);

        await deletePlanService(planId, userId);

        return res.status(200).json({ message: 'Plan deleted successfully' });

    } catch (error) {
        next(error);
    }
}