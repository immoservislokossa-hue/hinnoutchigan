import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Télécharge un document interne : la RLS vérifie d'abord (avec le compte de l'utilisateur)
 * qu'il peut voir la ligne ; la clé de service ne sert qu'à signer l'URL du fichier.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { profile } = await getSession();
  if (!profile || profile.status !== "active") return new NextResponse("Non autorisé", { status: 401 });
  if (!UUID.test(id)) return new NextResponse("Requête invalide", { status: 400 });
  const supabase = await createClient();
  const { data: doc } = await supabase.from("documents").select("file_path,visibility").eq("id", id).maybeSingle();
  if (!doc) return new NextResponse("Introuvable", { status: 404 });
  const path = doc.file_path as string;
  if (path.startsWith("/") || /^https?:/.test(path)) return NextResponse.redirect(new URL(path, _req.url));
  const bucket = doc.visibility === "public" ? "public-files" : "private-files";
  const signer = hasServiceRole() ? createAdminClient() : supabase;
  const { data, error } = await signer.storage.from(bucket).createSignedUrl(path, 120);
  if (error || !data) return new NextResponse("Fichier indisponible", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
