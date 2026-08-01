import { db } from "../../config/db";
import { RowDataPacket } from "mysql2";

//funcao para adicionar um exercicio a uma rotina:
export async function addExerciseToRoutineService(
    { routineId, exerciseId, sets, reps, notes, exercise_order, rest_seconds }: { routineId: number; exerciseId: number; sets: number; reps: number; notes: string; exercise_order: number; rest_seconds: number },
    userId: number
) {

    const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM routines WHERE id = ? AND trainer_id = ?",
        [routineId, userId]
    );

    if (rows.length === 0) {
        throw new Error("Routine not found or not yours.");
    }

    const [exerciseRows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM exercises WHERE id = ? AND trainer_id = ?",
        [exerciseId, userId]
    );

    if (exerciseRows.length === 0) {
        throw new Error("Exercise not found.");
    }

    const [result] = await db.query(
        "INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps, notes, exercise_order, rest_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [routineId, exerciseId, sets, reps, notes, exercise_order, rest_seconds]
    );
    return result;
}


//pegar um exercicio de uma rotina pelo id da rotina e do exercicio:
export async function getExercisesByRoutineIdService(routineId: number, userId: number) {

    const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM routines WHERE id = ? AND trainer_id = ?",
        [routineId, userId]
    );

    if (rows.length === 0) {
        throw new Error("Routine not found or not yours.");
    }

    const [exercises] = await db.query(
    `SELECT re.id, re.routine_id, re.exercise_id, re.sets, re.reps, 
       re.rest_seconds, re.notes, re.exercise_order, 
       e.name AS exercise_name, e.video_url
FROM routine_exercises re 
JOIN exercises e ON re.exercise_id = e.id 
WHERE re.routine_id = ? 
ORDER BY re.exercise_order ASC`,
        [routineId]
);

    if (exercises.length === 0) {
        return [];
    }

    return exercises;
}


//atualizar um exercicio de uma rotina pelo id da rotina e do exercicio:
export async function updateExerciseInRoutineService(id: number, userId: number, { sets, reps, notes, exercise_order, rest_seconds }: { sets: number; reps: number; notes: string; exercise_order: number; rest_seconds: number }) {

    // verificar que el registro existe y la rutina es del trainer
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT re.id FROM routine_exercises re
         JOIN routines r ON re.routine_id = r.id
         WHERE re.id = ? AND r.trainer_id = ?`,
        [id, userId]
    );

    if (rows.length === 0) {
        throw new Error("Exercise not found in routine or not yours.");
    }

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    if (sets !== undefined) {
        fieldsToUpdate.push("sets = ?");
        values.push(sets);
    }

    if (reps !== undefined) {
        fieldsToUpdate.push("reps = ?");
        values.push(reps);
    }

    if (notes !== undefined) {
        fieldsToUpdate.push("notes = ?");
        values.push(notes);
    }

    if (exercise_order !== undefined) {
        fieldsToUpdate.push("exercise_order = ?");
        values.push(exercise_order);
    }

    if (rest_seconds !== undefined) {
        fieldsToUpdate.push("rest_seconds = ?");
        values.push(rest_seconds);
    }

    if (fieldsToUpdate.length === 0) {
        throw new Error("No fields to update.");
    }
    const sql = `UPDATE routine_exercises SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(id);
    await db.query(sql, values);
}


//apagar um exercicio de uma rotina pelo id da rotina e do exercicio:
export async function deleteExerciseFromRoutineService(routineId: number, exerciseId: number, userId: number) {

    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT re.id FROM routine_exercises re
         JOIN routines r ON re.routine_id = r.id
         WHERE re.routine_id = ? AND re.exercise_id = ? AND r.trainer_id = ?`,
        [routineId, exerciseId, userId]
    );
    if (rows.length === 0) {
        throw new Error("Exercise not found in routine or not yours.");
    }

    await db.query("DELETE FROM routine_exercises WHERE id = ?", [rows[0].id]);
}   
