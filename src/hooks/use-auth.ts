"use client";

import { useSession } from "@/lib/auth";
import { ROLE } from "@/types/auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = false) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && requireAuth && !session) {
      redirect("/login");
    }
  }, [session, isPending, requireAuth, router]);

  return { session, isPending };
}

export function useRequireAdmin() {
  const { session, isPending } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) return;

    if (session.user.role !== ROLE.ADMIN) {
      redirect("/");
    }
  }, [session, isPending, router]);

  return { session, isPending };
}
