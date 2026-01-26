import { ROLE } from "@/types/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "./lib/auth";

const AUTH_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const PROTECTED_ROUTES = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await getSession({
    fetchOptions: {
      headers: request.headers,
    },
  });

  // 1. If user is logged in and trying to access auth routes (login/register), redirect to dashboard
  if (session && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. If user is NOT logged in and trying to access protected routes, redirect to login
  if (
    !session &&
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    const searchParams = new URLSearchParams(request.nextUrl.search);
    searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(
      new URL(`/login?${searchParams.toString()}`, request.url),
    );
  }

  // 3. Admin specific protection
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session || session.user.role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
