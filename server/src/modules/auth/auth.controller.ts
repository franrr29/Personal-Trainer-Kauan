import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwt';
import { findUserById } from './auth.service';


// Função de callback para o login com Google e redirecionamento para o frontend com o token JWT
export async function googleCallback(req: any, res: any) {

    const user = req.user;

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    res.cookie('token', generateToken(user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.redirect(process.env.FRONTEND_URL!);
}


//funcão para obter o usuário autenticado a partir do token JWT
export async function getUser(req: any, res: any) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const user = await findUserById(decoded.userId);
        if (!user) {
         return res.status(404).json({ message: 'User not found' });
}

        return res.status(200).json({ user });
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}



//função para deslogar o usuário, removendo o token JWT do cookie
export async function logout(req: any, res: any) {

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.redirect(process.env.FRONTEND_URL!);
}