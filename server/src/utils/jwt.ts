//gera o token JWT para o usuário autenticado
import jwt from 'jsonwebtoken';


export function generateToken(userId: number): string {

    const payload = { userId };
    const secretKey = process.env.JWT_SECRET!;
    const options = { expiresIn: '7d' }; 

    return jwt.sign(payload, secretKey, options); 
}