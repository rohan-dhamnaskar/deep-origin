import Hapi from "@hapi/hapi";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { initRedisClient, closeRedisConnection } from "./connections/redis";
import {
  initPostgresClient,
  closePostgresConnection,
} from "./connections/postgres";
import { registerShortenerRoutes } from "./routes/shortenerRoutes";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"], // For development, can be restricted in production
        credentials: true,
        headers: ["Accept", "Content-Type", "Authorization"],
        additionalHeaders: ["X-Requested-With"],
      },
    },
  });

  // Register routes
  await Promise.all([initRedisClient(), initPostgresClient()]);

  registerShortenerRoutes(server);

  // Base route
  server.route({
    method: "GET",
    path: "/",
    handler: (request: Request, h: ResponseToolkit) => {
      return "Welcome to the URL Shortener API!";
    },
  });

  // Server shutdown handler
  server.events.on("stop", async () => {
    await Promise.all([closeRedisConnection() /*, closePostgresConnection()*/]);
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err: Error) => {
  console.log(err);
  process.exit(1);
});

init();
