import { db } from '../../config/db';
import { RowDataPacket } from 'mysql2';


export async function getNotificationsService(userId: number) {

    //muestro siemrpe las primeras notific
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM notifications WHERE trainer_id = ? ORDER BY created_at DESC", [userId]);

    return rows;
}


//marcar notifacacao como lida
export async function markNotificationAsReadService(notificationId: number, userId: number) {

    const [result] = await db.query("UPDATE notifications SET is_read = true WHERE id = ? AND trainer_id = ?", [notificationId, userId]);

    if ((result as any).affectedRows === 0) {

        throw new Error('Notification not found or does not belong to the user');
    }

    return { message: 'Notification marked as read' };
}


//funcao para criar uma nova notificacao que llama al webhook de mp para notificar al usuario
export async function createNotificationService(trainerId: number, message: string) {

    await db.query("INSERT INTO notifications (trainer_id, message) VALUES (?, ?)", [trainerId, message]);

    return { message: 'Notification created' };
}