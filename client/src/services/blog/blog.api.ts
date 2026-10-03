import { API_ERROR_CODES, ApiError } from "@/lib/http";
import { mockPosts } from "./mock/posts";
import type { Post, PostSummary } from "./blog.types";

// TODO: swap the mock for the CMS once it exists, e.g.
//   list: () => publicClient.get<ApiResponse<PostSummary[]>>("/blog/posts").then(unwrap)
//   get:  (slug) => publicClient.get<ApiResponse<Post>>(`/blog/posts/${slug}`).then(unwrap)
// The shapes in blog.types.ts are the contract the backend should return.
export const blogApi = {
  list: async (): Promise<PostSummary[]> =>
    mockPosts.map(({ content: _content, ...summary }) => summary),

  get: async (slug: string): Promise<Post> => {
    const post = mockPosts.find((item) => item.slug === slug);
    if (!post) {
      throw new ApiError({
        message: "Post not found",
        status: 404,
        errorCode: API_ERROR_CODES.BLOG_POST_NOT_FOUND,
      });
    }
    return post;
  },
};
