"use client";

import { PostForm } from "@/components/post-form";
import { useCreatePost } from "@/hooks/use-posts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();

  const handleSubmit = async (data: any) => {
    try {
      await createPost.mutateAsync({
        ...data,
        tags: data.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t),
      });

      toast.success("Post created successfully");
      router.push("/dashboard/posts");
    } catch {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Post</h1>
        <p className="text-muted-foreground">Write and publish a new article</p>
      </div>

      <PostForm onSubmit={handleSubmit} isLoading={createPost.isPending} />
    </div>
  );
}
