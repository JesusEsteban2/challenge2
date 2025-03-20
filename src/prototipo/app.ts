import express from 'express';
import { resolve } from 'path';
import cors from 'cors';
import { CreateRouter } from './create.router.js';
import { ErrorManager } from './error.manager.js';

export const createApp = () => {
    console.log('Iniciando App...');
    // Creación de manejador de errores.
    const errorManager = new ErrorManager();
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
    const createRouter = new CreateRouter();
    // Registrar
    app.use('/productos', createRouter.createProductRouter());

    // Not found & not method
    app.get('*', errorManager.notFoundController.bind(errorManager));
    app.use('*', errorManager.notMethodController.bind(errorManager));

    app.use(errorManager.errorController.bind(errorManager));

    return app;
};
