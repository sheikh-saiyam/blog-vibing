"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeletePost, useMyPosts } from "@/hooks/use-posts";
import { Post } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Inbox,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const statusStyles = {
  PUBLISHED: "bg-white text-emerald-600 border-emerald-500/20",
  DRAFT: "bg-white text-amber-600 border-amber-500/20",
  ARCHIVED: "bg-white text-slate-600 border-slate-500/20",
};

export default function MyPostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isPending } = useMyPosts({
    page,
    limit: 10,
    search: search || undefined,
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">My Posts</h1>
          <p className="text-muted-foreground">
            Manage and monitor your blog content performance.
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="gap-2 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.02]">
            <Plus className="h-5 w-5" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 pb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            className="w-full bg-card/40 border-none ring-1 ring-border/60 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-dashed"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {data.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>

          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 pt-8">
              <Button
                variant="ghost"
                className="gap-2 rounded-xl"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: data.meta.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                      page === i + 1
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                        : "hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="gap-2 rounded-xl"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.meta.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="border-2 border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground text-center max-w-[280px] mb-8">
              You haven't created any blog posts yet. Start sharing your
              thoughts!
            </p>
            <Link href="/dashboard/posts/new">
              <Button className="gap-2 shadow-xl shadow-primary/10 transition-transform hover:scale-105">
                <Plus className="h-4 w-4" />
                Create your first post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const deletePost = useDeletePost(post.id);

  return (
    <motion.div variants={item} layout>
      <Card className="group overflow-hidden border-none shadow-sm shadow-black/5 bg-card/60 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-black/10 hover:ring-1 hover:ring-primary/20">
        <div className="px-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          {/* Thumbnail */}
          <div className="relative h-32 w-full sm:w-60 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border/50 shadow-inner">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400";
                }}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            <Badge
              className={`absolute top-2 right-2 text-[10px] px-2 h-5 flex items-center shadow-sm uppercase font-bold tracking-tight border-none bg-white ${
                statusStyles[post.status]
              }`}
            >
              {post.status.toLowerCase()}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-1">
              <Link href={`/posts/${post.id}`} className="block group/link">
                <h3 className="text-lg font-bold leading-tight line-clamp-1 flex items-center gap-2 group-hover/link:text-primary transition-colors">
                  {post.title}
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
                </h3>
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-500/10">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views.toLocaleString()} views
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 sm:border-l border-border/50 pt-3 sm:pt-0 sm:pl-5">
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="flex-1 sm:flex-none"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-lg hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none gap-2 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                <AlertDialogTitle className="text-xl">
                  Delete post?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base py-2">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-foreground">
                    "{post.title}"
                  </span>
                  ? This action is permanent and cannot be undone.
                </AlertDialogDescription>
                <div className="flex gap-3 justify-end pt-4">
                  <AlertDialogCancel className="rounded-xl border-none bg-muted hover:bg-muted/80">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deletePost.mutate()}
                    disabled={deletePost.isPending}
                    className="rounded-xl bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                  >
                    {deletePost.isPending ? "Deleting..." : "Delete Post"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
