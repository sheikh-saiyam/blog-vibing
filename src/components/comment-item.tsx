"use client";

import type { Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useUpdateComment,
  useDeleteComment,
  useUpdateCommentStatus,
  useCreateComment,
} from "@/hooks/use-comments";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (parentId: string | null) => void;
  replyingTo: string | null;
  depth?: number;
}

export function CommentItem({
  comment,
  postId,
  onReply,
  replyingTo,
  depth = 0,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  // Reply State
  const [replyContent, setReplyContent] = useState("");

  const updateComment = useUpdateComment(comment.id, postId);
  const deleteComment = useDeleteComment(comment.id, postId);
  const updateStatus = useUpdateCommentStatus(comment.id);
  const createComment = useCreateComment();

  const isAuthor = session?.user.id === comment.authorId;
  const isAdmin = session?.user.role === "ADMIN";
  const isReplying = replyingTo === comment.id;

  const handleEdit = async () => {
    if (editContent.trim()) {
      await updateComment.mutateAsync({ content: editContent });
      setIsEditing(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    await createComment.mutateAsync({
      content: replyContent,
      postId,
      parentId: comment.id,
    });

    setReplyContent("");
    onReply(null); // Close reply form
  };

  return (
    <div
      className={`group ${
        depth > 0 ? "ml-5 pl-5 border-l-2 border-muted" : ""
      }`}
    >
      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  comment?.author?.image || "https://via.placeholder.com/150"
                }
              />
              <AvatarFallback className="text-[10px]">
                {comment?.author?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">
                {comment?.author?.name || "Anonymous"}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {comment.status === "REJECTED" && (
              <Badge variant="destructive" className="text-[10px] px-1 h-5">
                Rejected
              </Badge>
            )}
            {isAdmin && comment.status === "APPROVED" && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1 h-5 bg-green-100 text-green-800 hover:bg-green-100"
              >
                Approved
              </Badge>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-2 pl-8">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={updateComment.isPending}
              >
                {updateComment.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="pl-8">
            <p className="text-[15px] leading-relaxed mb-2 text-foreground/90">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onReply(isReplying ? null : comment.id)}
                className={`text-xs font-medium transition-colors ${
                  isReplying
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reply
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteComment.mutate()}
                    disabled={deleteComment.isPending}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    {deleteComment.isPending ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
              {isAdmin && comment.status === "APPROVED" && (
                <button
                  onClick={() => updateStatus.mutate("REJECTED")}
                  disabled={updateStatus.isPending}
                  className="text-xs font-medium text-orange-500 hover:text-orange-700 transition-colors"
                >
                  Reject
                </button>
              )}
              {isAdmin && comment.status === "REJECTED" && (
                <button
                  onClick={() => updateStatus.mutate("APPROVED")}
                  disabled={updateStatus.isPending}
                  className="text-xs font-medium text-green-500 hover:text-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
            </div>

            {/* Inline Reply Form */}
            {isReplying && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>
                      {session?.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      autoFocus
                      placeholder={`Reply to ${
                        comment.author.name || "user"
                      }...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReply(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleReplySubmit}
                        disabled={
                          !replyContent.trim() || createComment.isPending
                        }
                      >
                        {createComment.isPending && (
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        )}
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              replyingTo={replyingTo}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
