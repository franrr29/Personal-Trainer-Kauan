import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';


//funcion que valida la req del body 
export function validateBody(schema: z.ZodSchema<any>) {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            await schema.parseAsync(req.body);
            next();

        } catch (error) {

            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            next(error);
        }
    };
}