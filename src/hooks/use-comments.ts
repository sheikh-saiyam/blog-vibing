"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CommentsResponse, GetALlCommentsParams } from "@/types";

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: {
      content: string;
      postId: string;
      parentId?: string;
    }) => {
      const { data } = await api.post("/comments", comment);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });
}

export function useUpdateComment(id: string, postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: { content: string }) => {
      const { data } = await api.patch(`/comments/${id}`, comment);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId?: string }) => {
      await api.delete(`/comments/${id}`);
      return { id, postId };
    },
    onSuccess: (_, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
    }) => {
      const { data } = await api.patch(`/comments/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useAllComments(params: GetALlCommentsParams) {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: async () => {
      const { data } = await api.get<CommentsResponse>("/comments/all", {
        params,
      });
      return data;
    },
  });
}
