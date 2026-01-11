"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePosts } from "@/hooks/use-posts";
import api from "@/lib/api";
import { useSession } from "@/lib/auth";
import type { StatsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Archive,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  UserCheck,
  UserPlus,
} from "lucide-react";

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: myPosts } = usePosts();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const { data } = await api.get<StatsResponse>("/posts/stats");
        return data.data;
      } catch {
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4 h-64 bg-muted animate-pulse rounded-xl" />
          <div className="lg:col-span-3 h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { totalAgg, viewsAgg, commentAgg } = stats;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back,{" "}
          <span className="text-foreground font-medium">
            {session?.user.name}
          </span>
          . Here's what's happening.
        </p>
      </div>

      {/* Main Aggregates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Posts",
            value: totalAgg.total,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Views",
            value: viewsAgg.total.toLocaleString(),
            icon: Eye,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Comments",
            value: commentAgg.total,
            icon: MessageSquare,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            label: "My Posts",
            value: myPosts?.meta.total || 0,
            icon: Star,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ].map((stat, i) => (
          <motion.div variants={item} key={i}>
            <Card className="border-none shadow-sm shadow-black/5 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Post Distribution */}
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="h-full border-none shadow-sm shadow-black/5">
            <CardHeader>
              <CardTitle className="text-lg">Post Status</CardTitle>
              <CardDescription>Breakdown by publication status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Published",
                    value: totalAgg.totalPublished,
                    icon: CheckCircle2,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Drafts",
                    value: totalAgg.totalDraft,
                    icon: Clock,
                    color: "bg-amber-500",
                  },
                  {
                    label: "Archived",
                    value: totalAgg.totalArchived,
                    icon: Archive,
                    color: "bg-slate-500",
                  },
                  {
                    label: "Featured",
                    value: totalAgg.totalFeatured,
                    icon: Star,
                    color: "bg-yellow-500",
                  },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <s.icon
                        className={`h-4 w-4 ${s.color.replace("bg-", "text-")}`}
                      />
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="ml-auto text-sm font-bold">
                        {s.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(s.value / (totalAgg.total || 1)) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${s.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* View Statistics */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full border-none shadow-sm shadow-black/5">
            <CardHeader>
              <CardTitle className="text-lg">Readership</CardTitle>
              <CardDescription>Views engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Views</p>
                    <p className="text-xs text-muted-foreground">Per post</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{viewsAgg.avg}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Min Views
                  </span>
                  <span className="text-2xl font-bold">{viewsAgg.min}</span>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Max Views
                  </span>
                  <span className="text-2xl font-bold">{viewsAgg.max}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Author Breakdown */}
        <motion.div variants={item}>
          <Card className="grid place-items-stretch h-full border-none shadow-sm shadow-black/5">
            <CardHeader className="space-y-0">
              <div>
                <CardTitle className="text-lg">Community</CardTitle>
                <CardDescription>Authors and contributors</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-around py-4">
              <div className="flex flex-row items-center gap-3">
                <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
                  <UserCheck className="h-8 w-8" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">
                    {totalAgg.totalAuthorsAdmin}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    Admins
                  </p>
                </div>
              </div>
              <div className="h-18 w-px bg-border/50" />
              <div className="flex flex-row items-center gap-3">
                <div className="p-4 rounded-full bg-pink-500/10 text-pink-500">
                  <UserPlus className="h-8 w-8" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">
                    {totalAgg.totalAuthorsUser}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    Authors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comment Management */}
        <motion.div variants={item}>
          <Card className="border-none shadow-sm shadow-black/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Moderation</CardTitle>
                <CardDescription>Comment status overview</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-bold tracking-widest"
              >
                Real-time
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">
                    {commentAgg.totalApproved}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Approved comments
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xl font-bold text-destructive/80">
                    {commentAgg.totalRejected}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Rejected
                  </p>
                </div>
              </div>
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (commentAgg.totalApproved / (commentAgg.total || 1)) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="bg-emerald-500 h-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (commentAgg.totalRejected / (commentAgg.total || 1)) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 1 }}
                  className="bg-destructive/40 h-full"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>Total Interactions: {commentAgg.total}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
