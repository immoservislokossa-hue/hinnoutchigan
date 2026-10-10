import { NextResponse } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Retour des liens e-mail au format « code » (PKCE) : échange le code contre une session. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/espace");
  if (isSupabaseConfigured && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/connexion?error=lien`);
}
