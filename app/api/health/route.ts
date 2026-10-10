import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { hasServiceRole } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Sonde de santé : ne révèle aucune valeur secrète. */
export function GET() {
  return NextResponse.json({ status: "ok", supabase: isSupabaseConfigured, serviceRole: hasServiceRole() }, { headers: { "Cache-Control": "no-store" } });
}
