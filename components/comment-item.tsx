"use client"

import type { Comment } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useUpdateComment, useDeleteComment, useUpdateCommentStatus } from "@/hooks/use-comments"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useSession } from "@/lib/auth"

interface CommentItemProps {
  comment: Comment
  postId: string
  onReply: (parentId: string) => void
  depth?: number
}

export function CommentItem({ comment, postId, onReply, depth = 0 }: CommentItemProps) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const updateComment = useUpdateComment(comment.id, postId)
  const deleteComment = useDeleteComment(comment.id, postId)
  const updateStatus = useUpdateCommentStatus(comment.id)

  const isAuthor = session?.user.id === comment.authorId
  const isAdmin = session?.user.role === "ADMIN"

  const handleEdit = async () => {
    if (editContent.trim()) {
      await updateComment.mutateAsync({ content: editContent })
      setIsEditing(false)
    }
  }

  return (
    <div className={`${depth > 0 ? "ml-4 mt-3" : ""}`}>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-medium text-sm">{comment.author.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-1">
            {comment.status === "REJECTED" && (
              <Badge variant="destructive" className="text-xs">
                Rejected
              </Badge>
            )}
            {isAdmin && comment.status === "APPROVED" && (
              <Badge variant="default" className="text-xs">
                Approved
              </Badge>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEdit} disabled={updateComment.isPending}>
                {updateComment.isPending ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm mb-3">{comment.content}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onReply(comment.id)}>
                Reply
              </Button>
              {isAuthor && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteComment.mutate()}
                    disabled={deleteComment.isPending}
                  >
                    {deleteComment.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </>
              )}
              {isAdmin && comment.status === "APPROVED" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus.mutate("REJECTED")}
                  disabled={updateStatus.isPending}
                >
                  Reject
                </Button>
              )}
              {isAdmin && comment.status === "REJECTED" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus.mutate("APPROVED")}
                  disabled={updateStatus.isPending}
                >
                  Approve
                </Button>
              )}
            </div>
          </>
        )}
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
