import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { rankingsApi } from "./rankings.api";
import type {
  AppCategory,
  AppComment,
  AppDetail,
  AppUpdateInput,
  FollowResult,
  HomeRankings,
  MakerProfile,
  MakerProfileInput,
  RankHistoryParams,
  RankPoint,
  RankingList,
  RankingParams,
  StoreLookup,
  SubmitAppInput,
  SubmitAppResult,
  VoteResult,
} from "./rankings.types";

export function useHomeRankings() {
  return useQuery<HomeRankings, ApiError>({
    queryKey: queryKeys.rankings.home(),
    queryFn: rankingsApi.home,
  });
}

export function useRankingCategories() {
  return useQuery<AppCategory[], ApiError>({
    queryKey: queryKeys.rankings.categories(),
    queryFn: rankingsApi.categories,
  });
}

// Keeps the previous list on screen while a new filter loads.
export function useRankings(params: RankingParams) {
  return useQuery<RankingList, ApiError>({
    queryKey: queryKeys.rankings.list(params),
    queryFn: () => rankingsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useAppDetail(slug: string | undefined) {
  return useQuery<AppDetail, ApiError>({
    queryKey: queryKeys.rankings.app(slug ?? ""),
    queryFn: () => rankingsApi.app(slug!),
    enabled: Boolean(slug),
  });
}

export function useRankHistory(slug: string, params: RankHistoryParams) {
  return useQuery<RankPoint[], ApiError>({
    queryKey: queryKeys.rankings.rankHistory(slug, params),
    queryFn: () => rankingsApi.rankHistory(slug, params),
    placeholderData: keepPreviousData,
  });
}

// The button keeps its own optimistic state; afterwards every cached list
// refetches so the same app shows the same count everywhere.
export function useVote(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<VoteResult, ApiError, boolean>({
    mutationFn: (voted) => rankingsApi.vote(slug, voted),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all }),
  });
}

export function useComments(slug: string) {
  return useQuery<AppComment[], ApiError>({
    queryKey: queryKeys.rankings.comments(slug),
    queryFn: () => rankingsApi.comments(slug),
  });
}

export function useAddComment(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<AppComment, ApiError, string>({
    mutationFn: (body) => rankingsApi.addComment(slug, body),
    onSuccess: (comment) =>
      queryClient.setQueryData<AppComment[]>(queryKeys.rankings.comments(slug), (list = []) => [...list, comment]),
  });
}

export function useMakerProfile(slug: string | undefined) {
  return useQuery<MakerProfile, ApiError>({
    queryKey: queryKeys.rankings.maker(slug ?? ""),
    queryFn: () => rankingsApi.maker(slug!),
    enabled: Boolean(slug),
  });
}

export function useFollowMaker(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<FollowResult, ApiError, boolean>({
    mutationFn: (following) => rankingsApi.follow(slug, following),
    onSuccess: (result) =>
      queryClient.setQueryData<MakerProfile>(queryKeys.rankings.maker(slug), (maker) => maker && { ...maker, ...result }),
  });
}

export function useStoreLookup() {
  return useMutation<StoreLookup, ApiError, string>({
    mutationFn: rankingsApi.lookupStore,
  });
}

export function useSubmitApp() {
  const queryClient = useQueryClient();
  return useMutation<SubmitAppResult, ApiError, SubmitAppInput>({
    mutationFn: rankingsApi.submitApp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all }),
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation<MakerProfile, ApiError, MakerProfileInput>({
    mutationFn: rankingsApi.updateMyProfile,
    onSuccess: (maker) => {
      queryClient.setQueryData(queryKeys.rankings.maker(maker.slug), maker);
      // App pages embed the maker card.
      void queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all });
    },
  });
}

export function useUpdateApp(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<AppDetail, ApiError, AppUpdateInput>({
    mutationFn: (input) => rankingsApi.updateApp(slug, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all }),
  });
}

export function useCancelLaunch() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: rankingsApi.cancelLaunch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all }),
  });
}
