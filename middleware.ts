import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED = ["/admin", "/espace"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!isSupabaseConfigured) {
    if (isProtected) return NextResponse.redirect(new URL("/connexion", request.url));
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (isProtected && !user) {
    const url = new URL("/connexion", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  // Les pages privées ne doivent jamais être mises en cache par un proxy
  if (isProtected) response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/espace/:path*", "/connexion", "/mot-de-passe-oublie", "/auth/:path*"],
};
