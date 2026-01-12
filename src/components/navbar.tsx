"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "@/lib/auth";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Bell, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-background border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-serif text-3xl font-bold tracking-tight"
          >
            BLOG VIBING
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            // 🔹 Loading UI
            <div className="flex items-center gap-4 animate-pulse">
              <div className="hidden md:flex h-8 w-20 rounded-md bg-muted" />
              <div className="h-9 w-9 rounded-full bg-muted" />
            </div>
          ) : session ? (
            <>
              <Link
                href="/dashboard/posts/new"
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span className="text-sm">Write</span>
              </Link>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full w-8 h-8 p-0 ml-2 overflow-hidden border"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-bold">
                        {session.user.name?.[0] || "U"}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 pt-1 text-sm font-semibold">
                    {session.user.name}
                  </div>
                  <div className="px-2 pb-1 text-sm text-foreground truncate">
                    {session.user.email}
                  </div>

                  <DropdownMenuSeparator />

                  <Link href="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>

                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/admin">
                        <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
                      </Link>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500 focus:bg-red-100 duration-300"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />

              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-accent px-4"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm" className="rounded-full px-4">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
