"use client";

import { useRequireAdmin } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  useAllComments,
  useUpdateCommentStatus,
  useDeleteComment,
} from "@/hooks/use-comments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { CommentStatus } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function AdminCommentsPage() {
  const { session, isPending } = useRequireAdmin();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CommentStatus | "ALL">("ALL");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{
    id: string;
    postId: string;
  } | null>(null);

  const { data, isLoading } = useAllComments({
    page,
    limit,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  });

  const updateStatusMutation = useUpdateCommentStatus();
  const deleteMutation = useDeleteComment();

  const handleUpdateStatus = (
    id: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    toast.promise(updateStatusMutation.mutateAsync({ id, status: newStatus }), {
      loading: "Updating status...",
      success: `Comment ${newStatus.toLowerCase()}`,
      error: "Failed to update status",
    });
  };

  const handleDeleteClick = (id: string, postId: string) => {
    setCommentToDelete({ id, postId });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      await deleteMutation.mutateAsync({
        id: commentToDelete.id,
        postId: commentToDelete.postId,
      });
      toast.success("Comment deleted successfully");
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!session) return null;

  const comments = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Manage Comments</h1>
          <p className="text-muted-foreground">
            Moderate and manage user interactions across all posts.
          </p>
        </div>
        <div className="flex bg-primary/5 border border-primary/10 px-4 py-2 rounded-2xl items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total
            </p>
            <p className="text-lg font-bold text-primary">{meta?.total || 0}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-card/40 border-none ring-1 ring-border/60 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as any);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-card/40 border-none ring-1 ring-border/60 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none px-1 py-0 shadow-sm shadow-black/5 bg-card/60 overflow-hidden rounded-xl">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="font-bold text-foreground py-4">
                  Comment
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Author
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Post
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Date
                </TableHead>
                <TableHead className="font-bold text-foreground text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24 ml-auto rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-muted-foreground"
                    >
                      <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <MessageSquare className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        No comments found
                      </p>
                      <p className="text-sm">
                        Try adjusting your filters or search terms
                      </p>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {comments.map((comment) => (
                    <motion.tr
                      key={comment.id}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, x: -20 }}
                      className="border-border/40 group hover:bg-primary/5 transition-colors"
                    >
                      <TableCell className="max-w-[300px] py-4">
                        <p className="text-sm font-medium leading-relaxed line-clamp-2">
                          {comment.content}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            {comment.author.name || "Anonymous"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                            {comment.author.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-primary hover:underline cursor-pointer line-clamp-1">
                          {comment.post.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize font-bold text-[10px] px-2 py-0.5 rounded-full border-none",
                            comment.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                          )}
                        >
                          {comment.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11px] font-bold text-muted-foreground/70">
                        {format(new Date(comment.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1.5">
                          {comment.status !== "APPROVED" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-500/20"
                              onClick={() =>
                                handleUpdateStatus(comment.id, "APPROVED")
                              }
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          {comment.status !== "REJECTED" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-500/20"
                              onClick={() =>
                                handleUpdateStatus(comment.id, "REJECTED")
                              }
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-500/20"
                            onClick={() =>
                              handleDeleteClick(comment.id, comment.postId)
                            }
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Showing <span className="text-foreground">{comments.length}</span>{" "}
              of <span className="text-foreground">{meta.total}</span> comments
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9 px-4 font-bold text-xs gap-2"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: meta.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-[11px] font-bold transition-all shadow-sm",
                      page === i + 1
                        ? "bg-primary text-primary-foreground shadow-primary/20 scale-110"
                        : "hover:bg-muted bg-card border border-border/40"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9 px-4 font-bold text-xs gap-2"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages || isLoading}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action is permanent and cannot be undone."
        confirmText="Delete Comment"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
