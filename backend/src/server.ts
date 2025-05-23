import Hapi from '@hapi/hapi';
import { Request, ResponseToolkit } from '@hapi/hapi';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            return "Welcome to the URL Shortener API!";
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err: Error) => {
    console.log(err);
    process.exit(1);
});

init();