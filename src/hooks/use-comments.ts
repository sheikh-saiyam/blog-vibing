"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

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

export function useDeleteComment(id: string, postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useUpdateCommentStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: "APPROVED" | "REJECTED") => {
      const { data } = await api.patch(`/comments/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
