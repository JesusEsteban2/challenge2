import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './http.error.type';

export class ErrorManager {
    constructor() {}

    notFoundController(req: Request, _res: Response, next: NextFunction) {
        console.log('Petición recibida');
        const message = `Page ${req.url} not found`;
        const error = new HttpError(message, 404, 'Not Found');
        next(error);
    }

    notMethodController(req: Request, _res: Response, next: NextFunction) {
        console.log('Petición recibida');
        const message = `Method ${req.method}  not allowed`;
        const error = new HttpError(message, 405, 'Method Not Allowed');
        next(error);
    }

    errorController(
        error: Error | HttpError,
        _req: Request,
        response: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // Errores de Prisma
        // if (error instanceof PrismaClientKnownRequestError) {
        //     const err = new HttpError(error.message, 400, 'Bad request error.');
        //     error = err;
        // }

        if (!('status' in error)) {
            error = {
                ...error,
                statusCode: 500,
                status: 'Internal Server Error',
            };
        }

        const publicMessage = `Error: ${error.statusCode} ${error.status}`;
        console.log(publicMessage, error.message);

        const html = `<p>${publicMessage}</p>`;
        response.statusCode = error.statusCode;
        response.statusMessage = error.status;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(html);
    }
}
