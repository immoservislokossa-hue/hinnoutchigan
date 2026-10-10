import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole, type AppRole } from "@/lib/roles";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  birth_date: string | null;
  sex: "F" | "M" | null;
  role: AppRole;
  status: "active" | "suspended";
  member_status: string;
  subgroup: "CCJ" | "CLAP" | "CSM" | null;
  member_number: string | null;
  post: string | null;
  department_slug: string | null;
  commune_id: string | null;
  region: string | null;
  photo_path: string | null;
  bio: string | null;
  created_at: string;
};

/** Session courante (mise en cache le temps de la requête). */
export const getSession = cache(async () => {
  if (!isSupabaseConfigured) return { user: null, profile: null as Profile | null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null as Profile | null };
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { user, profile: (profile as Profile | null) ?? null };
});

/** Exige un compte actif ; sinon redirige vers la connexion. */
export async function requireUser(next = "/espace") {
  const { user, profile } = await getSession();
  if (!user || !profile) redirect(`/connexion?next=${encodeURIComponent(next)}`);
  if (profile.status !== "active") redirect("/connexion?error=suspendu");
  return { user, profile };
}

/** Exige un rôle autorisé dans le back-office. */
export async function requireAdmin(next = "/admin") {
  const ctx = await requireUser(next);
  if (!isAdminRole(ctx.profile.role)) redirect("/espace");
  return ctx;
}

export async function requireRoles(roles: AppRole[], fallback = "/admin") {
  const ctx = await requireAdmin();
  if (!roles.includes(ctx.profile.role)) redirect(fallback);
  return ctx;
}

/** N'autorise que les redirections internes (anti « open redirect »). */
export function safeNext(value: string | null | undefined, fallback = "/espace") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
