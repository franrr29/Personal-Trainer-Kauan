import { db } from "../../config/db";
import { RowDataPacket } from "mysql2";

//funcao para criar uma nova rotina:
export async function createRoutineService(
  { day, title, trainer_note, student_id }: { day: string; title: string; trainer_note: string; student_id: number },
  userId: number
) {

    // verificar que el alumno pertenece al trainer
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE id = ? AND trainer_id = ? AND role = 'student'",
      [student_id, userId]
    );

    if (rows.length === 0) {
      throw new Error("Student not found or not yours.");
    }

    // crear la rutina
    const [result] = await db.query(
      "INSERT INTO routines (day, title, trainer_note, trainer_id, student_id) VALUES (?, ?, ?, ?, ?)",
      [day, title, trainer_note, userId, student_id]
    );

    return result;
}


//funcao para trazer rotinas pelo id do aluno:
export async function getRoutinesByStudentIdService(studentId: number, userId: number) {

    // verificar que el alumno pertenece al trainer
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE id = ? AND trainer_id = ? AND role = 'student'",
      [studentId, userId]
    );

    if (rows.length === 0) {
      throw new Error("Student not found or not yours.");
    }

    const [routines] = await db.query(
      "SELECT * FROM routines WHERE student_id = ? AND trainer_id = ?",
      [studentId, userId]
    );

    return routines;
}


//funcao para trazer uma rotina pelo id:
export async function getRoutineByIdService(routineId: number, userId: number) {

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM routines WHERE id = ? AND trainer_id = ?",
      [routineId, userId]
    );

    if (rows.length === 0) {
      throw new Error("Routine not found or not yours.");
    }

    return rows[0];
}

//funcao para atualizar uma rotina existente:
export async function updateRoutineService(
  routineId: number,
  { day, title, trainer_note }: { day: string; title: string; trainer_note: string },
  userId: number
) {

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM routines WHERE id = ? AND trainer_id = ?",
    [routineId, userId]
  );

  if (rows.length === 0) {
    throw new Error("Routine not found or not yours.");
  }

  //query dinamica para atualizar apenas os campos fornecidos
  const fields: string[] = [];
  const values: any[] = [];

    if (day !== undefined) { fields.push("day = ?"); values.push(day); }
    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (trainer_note !== undefined) { fields.push("trainer_note = ?"); values.push(trainer_note); }

  if (fields.length === 0) {
    throw new Error("No fields to update.");
  }

  const [result] = await db.query(
    `UPDATE routines SET ${fields.join(", ")} WHERE id = ? AND trainer_id = ?`,
    [...values, routineId, userId]
  );

  return result;
}


//apagar uma rotina existente:
export async function deleteRoutineService(routineId: number, userId: number) {

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM routines WHERE id = ? AND trainer_id = ?",
    [routineId, userId]
  );
  if (rows.length === 0) {
    throw new Error("Routine not found or not yours.");
  }

  const [result] = await db.query(
    "DELETE FROM routines WHERE id = ? AND trainer_id = ?",
    [routineId, userId]
  );

  return result;
}