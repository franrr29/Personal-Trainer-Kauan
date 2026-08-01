import { RowDataPacket } from "mysql2";
import { db } from "../../config/db";


//trazer todos os exercicios:
export async function getAllExercises(trainer_id: number): Promise<RowDataPacket[]> {

  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM exercises WHERE trainer_id = ?", [trainer_id]);

  if (rows.length === 0) {

    throw new Error("No exercises found for this user.");
  }

  return rows;
}


//trazer um exercicio pelo id:
export async function getExerciseById(id: number, trainer_id: number): Promise<RowDataPacket | null> {

  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM exercises WHERE id = ? AND trainer_id = ?", [id, trainer_id]);

  if (rows.length === 0) {
    throw new Error("Exercise not found in database.");
  }

  return rows[0] || null;
}


//criar um novo exercicio:
export async function createExercise(exerciseData: { name: string; category: string; description?: string; notes?: string },
    trainerId: number) {

    const { name, category, description, notes } = exerciseData;

    const [result] = await db.query(
        "INSERT INTO exercises (name, category, description, notes, trainer_id) VALUES (?, ?, ?, ?, ?)",
        [name, category, description, notes, trainerId]
    );

    return { id: (result as any).insertId };
}


//atualizar um exercicio com campos opcionais:
export async function updateExercise(id: number,exerciseData: { name?: string; category?: string;
     video_url?: string; description?: string; notes?: string },trainerId: number): Promise<void> {

  const { name, category, video_url, description, notes } = exerciseData;


  //query dinamica para atualizar apenas os campos fornecidos
  const fields: string[] = [];
  const values: any[] = [];

  if (name !== undefined) { fields.push("name = ?"); values.push(name); }
  if (category !== undefined) { fields.push("category = ?"); values.push(category); }
  if (video_url !== undefined) { fields.push("video_url = ?"); values.push(video_url); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description); }
  if (notes !== undefined) { fields.push("notes = ?"); values.push(notes); }

  if (fields.length === 0) {
    throw new Error("At least one field must be provided for update.");
  }

  values.push(id, trainerId);
  
  const query = `UPDATE exercises SET ${fields.join(", ")} WHERE id = ? AND trainer_id = ?`;

  await db.query(query, values);
}


//deletar um exercicio:
export async function deleteExercise(id: number, trainerId: number): Promise<void> {

    const deleteQuery = "DELETE FROM exercises WHERE id = ? AND trainer_id = ?";    
    await db.query(deleteQuery, [id, trainerId]);

}