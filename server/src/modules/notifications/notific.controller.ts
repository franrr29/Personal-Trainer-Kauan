import { Response, Request, NextFunction } from 'express';
import { getNotificationsService, markNotificationAsReadService } from './notific.service';




//funcao para obter todas as notificacoes de um usuario:
export async function getNotifications(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const notifications= await getNotificationsService(userId);

        return res.status(200).json({ notifications });
    } catch (error) {

        next(error);
    }
}

//funcao para marcar uma notificacao como lida:
export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {

    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const { id } = req.params;
        const notificationId = Number(id);

        await markNotificationAsReadService(notificationId, userId);

        return res.status(200).json({ message: 'Notification marked as read' });


    } catch (error) {
        next(error);
    }
}