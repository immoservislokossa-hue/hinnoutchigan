import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TYPES: EmailOtpType[] = ["invite", "recovery", "magiclink", "email", "signup", "email_change"];

/** Retour des liens e-mail au format « token_hash » (invitation, récupération). */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), "/auth/nouveau-mot-de-passe");
  if (isSupabaseConfigured && tokenHash && type && TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/connexion?error=lien`);
}
