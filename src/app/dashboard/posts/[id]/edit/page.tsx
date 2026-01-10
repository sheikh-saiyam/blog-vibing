"use client";

import { usePost, useUpdatePost } from "@/hooks/use-posts";
import { PostForm } from "@/components/post-form";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const router = useRouter();
  const { data: post, isPending } = usePost(postId);
  const updatePost = useUpdatePost(postId);

  const handleSubmit = async (data: any) => {
    try {
      await updatePost.mutateAsync({
        ...data,
        tags: data.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t),
      });

      toast.success("Post updated successfully");
      router.push("/dashboard/posts");
    } catch {
      toast.error("Failed to update post");
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">Update your article</p>
      </div>

      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        isLoading={updatePost.isPending}
      />
    </div>
  );
}
