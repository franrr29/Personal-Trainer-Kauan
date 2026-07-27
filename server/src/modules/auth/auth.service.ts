
import { db } from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function findOrCreateUser(email: string, name: string, avatar: string): Promise<{ id: number; email: string; name: string }> {

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
        return rows[0] as { id: number; email: string; name: string };

    } else {
        const [result] = await db.query<ResultSetHeader>('INSERT INTO users (email, name, avatar) VALUES (?, ?, ?)', [email, name, avatar]);
        const insertId = result.insertId;
        return { id: insertId, email, name };
    }
}


export async function findUserById(userId: number): Promise<{ id: number; email: string; name: string } | null> {

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length > 0) {
        return rows[0] as { id: number; email: string; name: string };
        
    } else {
        return null;
    }   
}