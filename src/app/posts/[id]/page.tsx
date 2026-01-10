"use client";

import { usePost } from "@/hooks/use-posts";
import { useCreateComment } from "@/hooks/use-comments";
import { useSession } from "@/lib/auth";
import { CommentItem } from "@/components/comment-item";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { data: post, isPending } = usePost(postId);
  const { data: session } = useSession();
  const createComment = useCreateComment();
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !session) return;

    await createComment.mutateAsync({
      content: commentContent,
      postId,
      parentId: replyingTo || undefined,
    });

    setCommentContent("");
    setReplyingTo(null);
  };

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Post not found</p>
        </Card>
      </div>
    );
  }

  const rootComments = post.comments?.filter((c) => !c.parentId) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground">
                By {post.author.name || "Anonymous"} on{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            {post.isFeatured && <Badge>Featured</Badge>}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.thumbnail && (
          <img
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose prose-sm max-w-none mb-12 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="text-sm text-muted-foreground">
            {rootComments.length}{" "}
            {rootComments.length === 1 ? "comment" : "comments"}
          </p>
        </div>

        {session ? (
          <Card className="p-4 mb-6">
            <div className="space-y-2">
              {replyingTo && (
                <p className="text-sm text-muted-foreground">
                  Replying to comment
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="ml-1 h-auto p-0"
                  >
                    (cancel)
                  </Button>
                </p>
              )}
              <Textarea
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || createComment.isPending}
              >
                {createComment.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Sign in to comment
            </p>
          </Card>
        )}

        <div className="space-y-4">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={setReplyingTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
