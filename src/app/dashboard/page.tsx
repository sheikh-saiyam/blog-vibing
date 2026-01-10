"use client";

import { useSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePosts } from "@/hooks/use-posts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { StatsResponse } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: myPosts } = usePosts();
  const { data: stats } = useQuery({
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name}
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalViews}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{myPosts?.meta.total || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
