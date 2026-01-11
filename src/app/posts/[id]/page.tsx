"use client";

import { usePost, usePosts } from "@/hooks/use-posts";
import { useCreateComment } from "@/hooks/use-comments";
import { useSession } from "@/lib/auth";
import { CommentItem } from "@/components/comment-item";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const router = useRouter();
  const { data: post, isPending } = usePost(postId);
  const { data: session } = useSession();
  const createComment = useCreateComment();
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Fetch recent posts for "Read Next"
  const { data: relatedPostsData } = usePosts({ limit: 3 });
  const relatedPosts =
    relatedPostsData?.data.filter((p) => p.id !== postId).slice(0, 3) || [];

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
      <div className="max-w-3xl mx-auto px-4 pt-28 py-12 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-28 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button onClick={() => router.push("/posts")}>Back to Home</Button>
      </div>
    );
  }

  const rootComments = post.comments?.filter((c) => !c.parentId) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[700px] mx-auto px-4 pt-28 py-12">
        <article className="mb-16">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage
                    src={
                      post?.author?.image || "https://via.placeholder.com/150"
                    }
                    alt={post?.author?.name || "Author Image"}
                  />
                  <AvatarFallback>
                    {post?.author?.name?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {post?.author?.name || "Anonymous"}
                    </span>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground font-normal"
                    >
                      Follow
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>·</span>
                    <span>5 min read</span> {/* Placeholder read time */}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Social Share Placeholders could go here */}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.thumbnail && (
            <figure className="mb-10 -mx-4 md:mx-0">
              <img
                src={post.thumbnail}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150";
                }}
                alt={post.title}
                className="w-full h-auto object-cover md:rounded-lg max-h-[500px]"
              />
              {/* Optional Caption */}
            </figure>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none font-serif leading-relaxed whitespace-pre-line">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-normal bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </article>

        <Separator className="my-10" />

        {/* Comments Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">
            Responses ({rootComments.length})
          </h2>

          {session ? (
            <div className="mb-10 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>
                    {session.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{session.user.name}</p>
                </div>
              </div>
              <Textarea
                placeholder="What are your thoughts?"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[100px] bg-transparent border-none resize-none focus-visible:ring-0 text-base p-0 shadow-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentContent.trim() || createComment.isPending}
                  className="rounded-full px-6"
                  size="sm"
                >
                  {createComment.isPending ? "Posting..." : "Respond"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/20 rounded-lg mb-8">
              <Link href="/login">
                <p className="mb-4 hover:underline">
                  Sign in to leave a comment
                </p>
              </Link>
            </div>
          )}

          <div className="space-y-8">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReply={setReplyingTo}
                replyingTo={replyingTo}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Read Next / Footer Section (Full Width Background) */}
      <div className="bg-muted/30 py-16 border-t">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="font-bold text-lg mb-8">Recommended for vibing...</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className="group cursor-pointer block"
              >
                {post.thumbnail && (
                  <div className="mb-4 overflow-hidden rounded-md h-40 bg-muted">
                    <img
                      src={post.thumbnail}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600x400")
                      }
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={post.author.image || ""} />
                    <AvatarFallback>
                      {post.author.name?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">
                    {post.author.name}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2 leading-snug group-hover:underline decoration-1 underline-offset-2 from-font-primary">
                  {post.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {post.content.substring(0, 100)}...
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{format(new Date(post.createdAt), "MMM d")}</span>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
