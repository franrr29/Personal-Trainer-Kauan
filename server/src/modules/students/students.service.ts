import { RowDataPacket } from "mysql2";
import { db } from "../../config/db";


//criar um novo aluno:
export async function createStudent(newStudent: { name: string; email: string; phone: string }, userId: number): Promise<void> {

    const { name, email, phone } = newStudent;

    const validateMail= await db.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (validateMail[0].length > 0) {
        throw new Error("Student with this email already exists.");
    }

    const insertQuery = "INSERT INTO users (name, email, phone, role, trainer_id) VALUES (?, ?, ?, ?, ?)";
    await db.query(insertQuery, [name, email, phone, 'student', userId]);


    return;
}


//trazer todos os alunos do treinador:
export async function getAllStudents(userId: number): Promise<RowDataPacket[]> {

    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE trainer_id = ? AND role = 'student'", [userId]);

    return rows;
}


//trazer um aluno pelo id para o treinador:
export async function getStudentById(studentId: number, userId: number): Promise<RowDataPacket | null> {

    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ? AND trainer_id = ? AND role = 'student'", [studentId, userId]);

    if (rows.length === 0) {
        throw new Error("Student not found.");
    }

    return rows[0] || null;
}


//atualizar um aluno com campos opcionais:
export async function updateStudent(studentId: number, updatedStudent: { name?: string; email?: string; phone?: string }, userId: number): Promise<void> {

    const { name, email, phone } = updatedStudent;

    //query dinamica para atualizar apenas os campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (email !== undefined) { fields.push("email = ?"); values.push(email); }
    if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }

    if (fields.length === 0) {
        throw new Error("No fields to update.");
    }

    //insertar la query dinamica para atualizar apenas os campos fornecidos
    const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ? AND trainer_id = ? AND role = 'student'`;
    values.push(studentId, userId);

    await db.query(updateQuery, values);
}



//mudar o status do aluno para ativo ou inativo, verificando o status atual
export async function toggleStatusStudent(studentId: number, userId: number): Promise<void> {

    const [rows] = await db.query<RowDataPacket[]>("SELECT status FROM users WHERE id = ? AND trainer_id = ? AND role = 'student'", [studentId, userId]);

    if (rows.length === 0) {
        throw new Error("Student not found.");
    }

    const currentStatus = rows[0].status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    await db.query("UPDATE users SET status = ? WHERE id = ? AND trainer_id = ? AND role = 'student'", [newStatus, studentId, userId]);
}