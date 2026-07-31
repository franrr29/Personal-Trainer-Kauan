import { db } from '../../config/db';
import { RowDataPacket } from 'mysql2';


//insertar um novo plano no banco de dados
export async function createPlanService(planData: { name: string; description: string; features: string;
     price: number; duration_value: number; duration_unit: string; userId: number }) {

    const { name, description, features, price, duration_value, duration_unit, userId } = planData;

    const [result] = await db.query(
        "INSERT INTO plans (trainer_id, name, description, features, price, duration_value, duration_unit) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, name, description, features, price, duration_value, duration_unit]
    );

    const insertId = (result as any).insertId;

    const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM plans WHERE id = ?",
        [insertId]
    );

    return rows[0];
}


//trazer todos os planos do treinador:
export async function getPlansService(userId: number): Promise<RowDataPacket[]> {

    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM plans WHERE trainer_id = ? AND active = true", [userId]);

    return rows;
}


//atualizar um plano do treinador:

export async function updatePlanService(planId: number, planData: { name?: string; description?: string; features?: string; price?: number;
     duration_value?: number; duration_unit?: string }, userId: number) {

        const { name, description, features, price, duration_value, duration_unit } = planData;

        //query dinamica para atualizar apenas os campos fornecidos
        const fields: string[] = [];
        const values: any[] = [];

        if (name !== undefined) { fields.push("name = ?"); values.push(name); }
        if (description !== undefined) { fields.push("description = ?"); values.push(description); }
        if (features !== undefined) { fields.push("features = ?"); values.push(features); }
        if (price !== undefined) { fields.push("price = ?"); values.push(price); }
        if (duration_value !== undefined) { fields.push("duration_value = ?"); values.push(duration_value); }
        if (duration_unit !== undefined) { fields.push("duration_unit = ?"); values.push(duration_unit); }

        if (fields.length === 0) throw new Error("No fields to update.");

        values.push(planId, userId);

        const updateQuery = `UPDATE plans SET ${fields.join(", ")} WHERE id = ? AND trainer_id = ?`;

        await db.query(updateQuery, values);

        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM plans WHERE id = ? AND trainer_id = ?",
            [planId, userId]
        );

        return rows[0];
     }


 //apagar um plano do treinador com update para nao perder informacao de pagamentos e historico de planos:
export async function deletePlanService(planId: number, userId: number): Promise<void> {

    await db.query("UPDATE plans SET active = false WHERE id = ? AND trainer_id = ?", [planId, userId]);
}