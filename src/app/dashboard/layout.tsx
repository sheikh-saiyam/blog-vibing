"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, LayoutDashboard, PenSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

const sidebarLinks = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    name: "Create Post",
    href: "/dashboard/posts/new",
    icon: PenSquare,
  },
  {
    name: "Comments",
    href: "/dashboard/admin",
    icon: MessageSquare,
    adminOnly: true,
  },
];

import useAuth from "@/hooks/use-auth";
import { MessageSquare } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending } = useAuth();
  const pathname = usePathname();

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <Skeleton className="h-[600px] rounded-2xl" />
          <div className="md:col-span-3 space-y-6">
            <Skeleton className="h-12 w-1/3 rounded-xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28 space-y-6"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-sm shadow-black/5">
              <div className="p-4 border-b border-border/40 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold truncate">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="p-2 space-y-1">
                {sidebarLinks
                  .filter((link) => !link.adminOnly || user?.role === "ADMIN")
                  .map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/dashboard" &&
                        pathname.startsWith(link.href));

                    return (
                      <Link key={link.href} href={link.href}>
                        <button
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <link.icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-primary",
                            )}
                          />
                          {link.name}
                          {isActive && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
                            />
                          )}
                        </button>
                      </Link>
                    );
                  })}
              </nav>

              <div className="p-4 border-t border-border/40 mt-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4 text-center">
                  Dashboard
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/50 border border-border/40">
                    <span className="text-xs font-bold">12</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">
                      Posts
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/50 border border-border/40">
                    <span className="text-xs font-bold">1.2k</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">
                      Views
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
              <p className="text-xs font-bold mb-1 italic">Pro Tip</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use relevant tags to increase your post's visibility by up to
                40%.
              </p>
            </div>
          </motion.div>
        </aside>

        <main className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
