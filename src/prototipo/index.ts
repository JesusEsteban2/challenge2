import { createServer } from 'node:http';
import express from 'express';
import { resolve } from 'path';
import cors from 'cors';
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { DATA } from './data/data.js';

//Datos de prueba
let dataArray = DATA;

class HttpError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public status: string,
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

// Error 404 - Not Found
function notFoundController(req: Request, _res: Response, next: NextFunction) {
    console.log('Petición recibida');
    const message = `Page ${req.url} not found`;
    const error = new HttpError(message, 404, 'Not Found');
    next(error);
}

// Error 405 - Method Not Allowed
function notMethodController(req: Request, _res: Response, next: NextFunction) {
    console.log('Petición recibida');
    const message = `Method ${req.method}  not allowed`;
    const error = new HttpError(message, 405, 'Method Not Allowed');
    next(error);
}

// Error 500 - Internal Server Error
function errorController(
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

// Product Get All
function productGetAll(req: Request, res: Response) {
    console.log('getAll');
    res.json(dataArray);
}

// product Get By Id
function productGetById(req: Request, res: Response) {
    console.log('getById');
    const { id } = req.params;
    const product = dataArray.find((pro) => pro.id === id);
    console.log(product);
    res.json(product);
}

function productPost(req: Request, res: Response) {
    console.log('Post');
    const pro = req.body;
    pro.id = crypto.randomUUID();
    dataArray.push(pro);
    res.json(dataArray);
}

function productPatch(req: Request, res: Response) {
    console.log('Patch');
    const prodChang = req.body;
    const change = prodChang.delete.id;
    const { id } = req.params;
    let product = dataArray.find((pro) => pro.id === id);
    product = { ...change };
    console.log(product);
    res.json(dataArray);
}

function productDelete(req: Request, res: Response) {
    const { id } = req.params;
    const newData = dataArray.filter((pro) => pro.id !== id);
    dataArray = newData;
    res.json(dataArray);
}

function createProductRouter() {
    console.log('Creating Product Router');
    const productRouter = Router();

    // getAll
    productRouter.get('/', productGetAll);
    // getById
    productRouter.get('/:id', productGetById);
    // add film
    productRouter.post('/', productPost);
    // modify by id
    productRouter.patch('/:id', productPatch);
    //delete
    productRouter.delete('/:id', productDelete);

    return productRouter;
}

const createApp = () => {
    console.log('Iniciando App...');

    // Inicialización de express
    const app = express();

    // Tomar path de la carpeta public.
    const publicPath = resolve('public');

    // Registrando Middleware.
    console.log('Registering Middleware...');
    // Habilitar Cors entre servidores.
    app.use(cors());
    // Usar parseado de Json.
    app.use(express.json());

    // Establecer ruta estática del proyecto desde public
    app.use(express.static(publicPath));

    /* App Routes */
    console.log('Creating routes...');

    // Registrar
    app.use('/productos', createProductRouter());

    // Not found & not method
    app.get('*', notFoundController);
    app.use('*', notMethodController);

    app.use(errorController);

    return app;
};

{
    // Modulo principal de creación de servidor.
    const PORT = 3000;

    // Creación del servidor
    try {
        // Inicializa Express
        const server = createServer(createApp());
        server.listen(PORT);
        //CallBack de inicialización de servidor.
        server.on('listening', () => listenManager());
    } catch (err) {
        console.error('Server Error', err);
        process.exit(1);
    }

    // Imprime mensaje de escucha del servidor, al resolver el callback.
    const listenManager = () => {
        console.log(`Server listening on http:/localhost:${PORT}`);
    };
}
