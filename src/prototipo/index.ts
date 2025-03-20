import { createServer } from 'node:http';
import { createApp } from './app.js';

// Puerto de escucha del servidor.
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
