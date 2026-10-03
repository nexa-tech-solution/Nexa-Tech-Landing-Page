import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { blogApi } from "./blog.api";
import type { Post, PostSummary } from "./blog.types";

export function usePosts() {
  return useQuery<PostSummary[], ApiError>({
    queryKey: queryKeys.blog.list(),
    queryFn: blogApi.list,
  });
}

export function usePost(slug: string | undefined) {
  return useQuery<Post, ApiError>({
    queryKey: queryKeys.blog.detail(slug ?? ""),
    queryFn: () => blogApi.get(slug!),
    enabled: Boolean(slug),
  });
}
