import Hapi from "@hapi/hapi";
import {
  shortenUrl,
  getOriginalUrl,
  getAllUrls,
} from "../services/urlShortener";

export const registerShortenerRoutes = (server: Hapi.Server): void => {
  server.route({
    method: "POST",
    path: "/shorten",
    handler: async (request, h) => {
      try {
        const payload = request.payload as { url: string };
        const shortCode = await shortenUrl(payload.url);

        return h
          .response({
            success: true,
            shortCode,
            shortUrl: `${request.headers.host}/${shortCode}`,
          })
          .code(200);
      } catch (err) {
        console.error("Error shortening URL:", err);
        return h
          .response({ success: false, error: "Failed to shorten URL" })
          .code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/shorten/{shortCode}",
    handler: async (request, h) => {
      try {
        const shortCode = request.params.shortCode;
        const originalUrl = await getOriginalUrl(shortCode);

        if (!originalUrl) {
          return h
            .response({ success: false, error: "URL not found" })
            .code(404);
        }

        return h
          .response({
            success: true,
            originalUrl,
          })
          .code(200);
      } catch (err) {
        console.error("Error retrieving URL:", err);
        return h
          .response({ success: false, error: "Failed to retrieve URL" })
          .code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/shorten",
    handler: async (request, h) => {
      try {
        const allUrls = await getAllUrls();
        if (!allUrls) {
          return h
            .response({
              success: false,
              error: "Could not find any URLs stored",
            })
            .code(400);
        }

        return h
          .response({
            success: true,
            allUrls,
          })
          .code(200);
      } catch (err) {
        console.error("Error retrieving URL:", err);
        return h
          .response({ success: false, error: "Failed to retrieve URL" })
          .code(500);
      }
    },
  });
};
