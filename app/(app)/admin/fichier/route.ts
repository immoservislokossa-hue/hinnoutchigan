import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

/** Ouvre un fichier privé via une URL signée de courte durée (accès contrôlé par la RLS du stockage). */
export async function GET(request: Request) {
  const { profile } = await getSession();
  if (!profile || profile.status !== "active" || !isAdminRole(profile.role)) return new NextResponse("Non autorisé", { status: 401 });
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!path || path.includes("..") || path.startsWith("/")) return new NextResponse("Requête invalide", { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("private-files").createSignedUrl(path, 120);
  if (error || !data) return new NextResponse("Fichier introuvable ou accès refusé", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
