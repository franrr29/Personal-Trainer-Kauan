// Agrega la propiedad userId al objeto request de express
// permite usar req.userId en cualquier ruta sin que typeScript marque error

declare global {
  namespace Express {
    interface Request {
      // Id del usuario autenticado
      userId?: number;
    }
  }
}

interface Request {
  userId?: number;
  userRole?: string;
}



// Hace que este archivo sea un modulo para que la extension de tipos funcione
export {};
