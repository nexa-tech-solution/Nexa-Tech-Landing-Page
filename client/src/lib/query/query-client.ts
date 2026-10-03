import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/http";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Auth/permission/validation errors won't fix themselves; only retry transient failures.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && [400, 401, 403, 404].includes(error.status)) && failureCount < 2,
    },
    mutations: { retry: false },
  },
});
