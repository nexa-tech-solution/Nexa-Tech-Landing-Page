import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { integrationsApi } from "./integrations.api";
import type {
  CreateIntegrationInput,
  Integration,
  IntegrationKey,
  IntegrationList,
  SaveIntegrationInput,
  SyncAllResult,
  SyncIntegrationResult,
  TestIntegrationResult,
} from "./integrations.types";

export const isSyncing = (i: Pick<Integration, "syncStatus">) =>
  i.syncStatus === "QUEUED" || i.syncStatus === "RUNNING";

export function useIntegrations() {
  return useQuery<IntegrationList, ApiError>({
    queryKey: queryKeys.integrations.list(),
    queryFn: integrationsApi.list,
    // Imports run in a backend job: poll while one is queued or running.
    refetchInterval: (query) =>
      query.state.data?.items.some(isSyncing) ? 3000 : false,
  });
}

// Fresh copy of one connection for the edit form; the list row may be stale.
export function useIntegration(id: number | null) {
  return useQuery<Integration, ApiError>({
    queryKey: queryKeys.integrations.detail(id ?? "none"),
    queryFn: () => integrationsApi.get(id!),
    enabled: id !== null,
    staleTime: 0,
  });
}

// Which contract the backend speaks is learned from the last list response.
const isLegacy = (queryClient: QueryClient) =>
  queryClient.getQueryData<IntegrationList>(queryKeys.integrations.list())
    ?.legacy ?? false;

// Status, last-checked and last-sync timestamps change after every action.
function useInvalidateIntegrations() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all });
}

// A 404 means the row was deleted elsewhere: reload so the stale card disappears.
const reloadIfStale = (invalidate: () => unknown) => (error: ApiError) => {
  if (error.status === 404) invalidate();
};

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateIntegrations();
  return useMutation<Integration, ApiError, CreateIntegrationInput>({
    mutationFn: (input) => integrationsApi.create(input, isLegacy(queryClient)),
    onSuccess: invalidate,
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateIntegrations();
  return useMutation<
    Integration,
    ApiError,
    { key: IntegrationKey; input: SaveIntegrationInput }
  >({
    mutationFn: ({ key, input }) =>
      integrationsApi.update(key, input, isLegacy(queryClient)),
    onSuccess: (saved) => {
      // The PUT response already is the fresh detail (status, connection check), so only the
      // list needs reloading.
      queryClient.setQueryData(queryKeys.integrations.detail(saved.key), saved);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.integrations.list(),
      });
    },
    onError: reloadIfStale(invalidate),
  });
}

export function useTestIntegration() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<TestIntegrationResult, ApiError, IntegrationKey>({
    mutationFn: integrationsApi.test,
    onSettled: invalidate,
  });
}

export function useSyncAllIntegrations() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<SyncAllResult, ApiError, void>({
    mutationFn: () => integrationsApi.syncAll(),
    onSettled: invalidate,
  });
}

export function useSyncIntegration() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<SyncIntegrationResult, ApiError, IntegrationKey>({
    mutationFn: integrationsApi.sync,
    onSuccess: invalidate,
    onError: reloadIfStale(invalidate),
  });
}

// Queues the chosen connections one request each; a failure on one does not stop the others.
export function useSyncIntegrations() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<SyncManyResult, ApiError, Integration[]>({
    mutationFn: async (targets) => {
      const results = await Promise.allSettled(
        targets.map((i) => integrationsApi.sync(i.key)),
      );
      return results.reduce<SyncManyResult>(
        (acc, result, index) => {
          const { name } = targets[index];
          if (result.status === "fulfilled") acc.queued.push(name);
          else acc.failed.push({ name, error: result.reason as ApiError });
          return acc;
        },
        { queued: [], failed: [] },
      );
    },
    onSettled: invalidate,
  });
}

export type SyncManyResult = {
  queued: string[];
  failed: { name: string; error: ApiError }[];
};

export function useDeleteIntegration() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<null, ApiError, IntegrationKey>({
    mutationFn: integrationsApi.remove,
    onSuccess: invalidate,
    onError: reloadIfStale(invalidate),
  });
}
