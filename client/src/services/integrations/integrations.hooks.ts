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
  SyncIntegrationResult,
  TestIntegrationResult,
} from "./integrations.types";

export function useIntegrations() {
  return useQuery<IntegrationList, ApiError>({
    queryKey: queryKeys.integrations.list(),
    queryFn: integrationsApi.list,
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
    onSuccess: invalidate,
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

export function useSyncIntegration() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<SyncIntegrationResult, ApiError, IntegrationKey>({
    mutationFn: integrationsApi.sync,
    onSuccess: invalidate,
    onError: reloadIfStale(invalidate),
  });
}

export function useDeleteIntegration() {
  const invalidate = useInvalidateIntegrations();
  return useMutation<null, ApiError, IntegrationKey>({
    mutationFn: integrationsApi.remove,
    onSuccess: invalidate,
    onError: reloadIfStale(invalidate),
  });
}
