"use client";

import { useRequireAdmin } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { session, isPending } = useRequireAdmin();

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <nav className="space-y-2">
            <a href="/admin" className="text-lg font-semibold">
              Admin Panel
            </a>
          </nav>
        </aside>

        <main className="md:col-span-3">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage posts and moderate comments
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
