import { handleRequest } from "./router.ts";
import { apiError } from "./shared/http.ts";

Deno.serve(async (request) => {
  try {
    return await handleRequest(request);
  } catch (error) {
    console.error(
      "API request failed",
      error instanceof Error ? error.name : "unknown",
    );
    return apiError(500, "COMMON-500", "error.server.unavailable");
  }
});
