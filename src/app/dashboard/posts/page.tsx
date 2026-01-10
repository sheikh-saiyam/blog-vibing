"use client";

import { useState } from "react";
import { useMyPosts, useDeletePost } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyPostsPage() {
  const [page, setPage] = useState(1);
  const { data, isPending } = useMyPosts({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-muted-foreground">Manage your published content</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.data.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No posts yet</p>
          <Link href="/dashboard/posts/new">
            <Button>Create your first post</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function PostListItem({ post }: { post: any }) {
  const deletePost = useDeletePost(post.id);

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex-1">
        <Link href={`/posts/${post.id}`}>
          <h3 className="font-semibold hover:underline">{post.title}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="capitalize">
            {post.status.toLowerCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/dashboard/posts/${post.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePost.mutate()}
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
