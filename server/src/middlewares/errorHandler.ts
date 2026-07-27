import { ErrorRequestHandler } from 'express';


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Configura o status code e a mensagem de erro
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err.stack);

  res.status(statusCode).json({ message });
}