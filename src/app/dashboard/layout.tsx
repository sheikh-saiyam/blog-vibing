"use client";

import type React from "react";

import { useRequireAdmin } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isPending } = useRequireAdmin();
  const pathname = usePathname();

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
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                Overview
              </Button>
            </Link>
            <Link href="/dashboard/posts">
              <Button
                variant={
                  pathname.startsWith("/dashboard/posts") ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                My Posts
              </Button>
            </Link>
            <Link href="/dashboard/posts/new">
              <Button
                variant={
                  pathname === "/dashboard/posts/new" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                Create Post
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
