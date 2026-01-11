"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import api from "@/lib/api";
import type { Post, PostsResponse } from "@/types";

interface PostsParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  isFeatured?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}

export function usePosts(params?: PostsParams) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: async () => {
      const { data } = await api.get<PostsResponse>("/posts", { params });
      return data;
    },
  });
}

export function useInfinitePosts(params?: Omit<PostsParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["posts-infinite", params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<PostsResponse>("/posts", {
        params: { ...params, page: pageParam },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
}

export function useMyPosts(params?: PostsParams) {
  return useQuery({
    queryKey: ["my-posts", params],
    queryFn: async () => {
      const { data } = await api.get<PostsResponse>("/posts/my-posts", {
        params,
      });
      return data;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Post }>(
        `/posts/${id}`
      );
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const { data } = await api.post("/posts", post);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const { data } = await api.patch(`/posts/${id}`, post);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });
}

export function useDeletePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
}
