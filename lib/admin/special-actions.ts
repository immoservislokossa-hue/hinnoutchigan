"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRoles } from "@/lib/auth";
import { SITE_URL } from "@/lib/env";
import { LEADERSHIP_ROLES, ALL_ROLES, type AppRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { departments } from "@/content/structure";
import { audit, flashQuery, isIsoDate, uploadFile } from "@/lib/admin/util";
import type { FormState } from "@/lib/admin/actions";

/* ----------------------------- Demandes reçues ----------------------------- */

export async function updateSubmissionAction(id: string, formData: FormData) {
  const { user, profile } = await requireRoles(LEADERSHIP_ROLES);
  const status = z.enum(["new", "in_progress", "done", "spam"]).safeParse(formData.get("status"));
  const notes = String(formData.get("notes") ?? "").slice(0, 4000);
  if (!status.success) redirect(`/admin/demandes/${id}${flashQuery(undefined, "Statut invalide.")}`);
  const supabase = await createClient();
  const { error } = await supabase
    .from("form_submissions")
    .update({ status: status.data, notes, assigned_to: profile.id })
    .eq("id", id);
  if (error) redirect(`/admin/demandes/${id}${flashQuery(undefined, "Mise à jour refusée.")}`);
  await audit(supabase, { id: user.id, email: user.email ?? null }, "update", "form_submissions", id, { status: status.data });
  redirect(`/admin/demandes/${id}${flashQuery("saved")}`);
}

/* ---------------------------------- Membres ---------------------------------- */

const emailSchema = z.string().trim().toLowerCase().email("Adresse e-mail invalide.");

const NON_ADMIN_ROLES: AppRole[] = ["member", "coord_region", "coord_dept", "communal", "arrondissement"];

export async function inviteMemberAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user, profile } = await requireRoles(LEADERSHIP_ROLES);
  const values = {
    email: String(formData.get("email") ?? ""),
    full_name: String(formData.get("full_name") ?? ""),
    role: String(formData.get("role") ?? "member"),
    department_slug: String(formData.get("department_slug") ?? ""),
  };
  const email = emailSchema.safeParse(values.email);
  if (!email.success) return { error: email.error.issues[0].message, values };
  if (values.full_name.trim().length < 2) return { error: "Le nom est obligatoire.", values };
  const role = values.role as AppRole;
  if (!ALL_ROLES.includes(role)) return { error: "Rôle invalide.", values };
  // Seul l'administrateur principal peut créer des comptes à privilèges
  if (profile.role !== "super_admin" && !NON_ADMIN_ROLES.includes(role)) {
    return { error: "Seul l'administrateur principal peut attribuer ce rôle.", values };
  }
  const dept = departments.find((d) => d.slug === values.department_slug);
  if (["coord_dept", "communal", "arrondissement"].includes(role) && !dept) {
    return { error: "Ce rôle exige un département.", values };
  }
  if (!hasServiceRole()) return { error: "Clé de service Supabase absente : invitations indisponibles.", values };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email.data, {
    data: { full_name: values.full_name.trim() },
    redirectTo: `${SITE_URL}/auth/callback?next=/auth/nouveau-mot-de-passe`,
  });
  if (error || !data.user) return { error: "Invitation impossible : " + (error?.message ?? "erreur inconnue"), values };

  // Le profil est créé par le déclencheur ; on complète rôle et périmètre (service_role : pas de JWT, donc pas de garde-fou)
  const { error: upErr } = await admin
    .from("profiles")
    .update({
      full_name: values.full_name.trim(),
      role,
      department_slug: dept?.slug ?? null,
      region: dept?.region ?? null,
    })
    .eq("id", data.user.id);
  if (upErr) return { error: "Compte créé mais profil non complété : " + upErr.message, values };

  const supabase = await createClient();
  await audit(supabase, { id: user.id, email: user.email ?? null }, "invite", "profiles", data.user.id, { email: email.data, role });
  redirect(`/admin/membres/${data.user.id}${flashQuery("invited")}`);
}

const memberSchema = z.object({
  full_name: z.string().trim().min(2, "Le nom est obligatoire.").max(160),
  phone: z.string().trim().max(30).optional().default(""),
  sex: z.enum(["F", "M", ""]).default(""),
  birth_date: z.string().trim().default(""),
  member_status: z.enum(["candidat", "adherent_engage", "benevole_occasionnel", "sympathisant", "honneur", "fondateur"]),
  subgroup: z.enum(["CCJ", "CLAP", "CSM", ""]).default(""),
  post: z.string().trim().max(120).default(""),
  department_slug: z.string().trim().default(""),
  region: z.string().trim().max(60).default(""),
  status: z.enum(["active", "suspended"]),
  role: z.enum(["super_admin", "editor", "ben", "coord_region", "coord_dept", "communal", "arrondissement", "member"]).optional(),
});

export async function saveMemberAction(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user, profile } = await requireRoles(LEADERSHIP_ROLES);
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = memberSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const d = parsed.data;
  if (d.birth_date && !isIsoDate(d.birth_date)) return { error: "Date de naissance invalide.", values };
  const dept = departments.find((x) => x.slug === d.department_slug);
  if (d.department_slug && !dept) return { error: "Département inconnu.", values };
  if (id === user.id && d.status === "suspended") return { error: "Vous ne pouvez pas suspendre votre propre compte.", values };

  const update: Record<string, unknown> = {
    full_name: d.full_name,
    phone: d.phone || null,
    sex: d.sex || null,
    birth_date: d.birth_date || null,
    member_status: d.member_status,
    subgroup: d.subgroup || null,
    post: d.post || null,
    department_slug: dept?.slug ?? null,
    region: d.region || dept?.region || null,
    status: d.status,
  };
  if (profile.role === "super_admin" && d.role) {
    if (id === user.id && d.role !== "super_admin") return { error: "Vous ne pouvez pas retirer votre propre rôle d'administrateur.", values };
    update.role = d.role;
  }
  const supabase = await createClient();
  const { error, count } = await supabase.from("profiles").update(update, { count: "exact" }).eq("id", id);
  if (error) return { error: "Enregistrement refusé : " + error.message, values };
  if (!count) return { error: "Membre introuvable ou accès refusé.", values };
  await audit(supabase, { id: user.id, email: user.email ?? null }, "update", "profiles", id, { status: d.status, member_status: d.member_status });
  redirect(`/admin/membres/${id}${flashQuery("saved")}`);
}

export async function verifyClauseAction(profileId: string) {
  const { user } = await requireRoles(LEADERSHIP_ROLES);
  const supabase = await createClient();
  await supabase.from("clauses").update({ verified: true, verified_by: user.id }).eq("profile_id", profileId);
  await audit(supabase, { id: user.id, email: user.email ?? null }, "verify", "clauses", profileId);
  redirect(`/admin/membres/${profileId}${flashQuery("saved")}`);
}

/* --------------------------------- Abonnés --------------------------------- */

export async function deleteSubscriberAction(id: string) {
  const { user } = await requireRoles(LEADERSHIP_ROLES);
  const supabase = await createClient();
  await supabase.from("newsletter_subscribers").delete().eq("id", id);
  await audit(supabase, { id: user.id, email: user.email ?? null }, "delete", "newsletter_subscribers", id);
  redirect(`/admin/abonnes${flashQuery("deleted")}`);
}

/* -------------------------------- Paramètres -------------------------------- */

const url = z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Les liens doivent commencer par https://");
const settingsSchema = z.object({
  contact_email: z.string().trim().max(254).refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Courriel invalide."),
  contact_phones: z.string().max(400),
  contact_address: z.string().trim().max(300),
  facebook: url, instagram: url, tiktok: url, linkedin: url, youtube: url, whatsapp: url,
  president_name: z.string().trim().max(160),
  president_message: z.string().trim().max(4000),
  president_vision: z.string().trim().max(3000),
  president_priorities: z.string().trim().max(3000),
  president_actions: z.string().trim().max(3000),
  president_commitments: z.string().trim().max(3000),
  press_contact: z.string().trim().max(400),
  legal_registry_number: z.string().trim().max(120),
  legal_publication_director: z.string().trim().max(160),
  legal_host: z.string().trim().max(300),
  legal_retention: z.string().trim().max(300),
});

export async function saveSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireRoles(LEADERSHIP_ROLES);
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const d = parsed.data;
  const supabase = await createClient();

  let photo_path: string | undefined;
  const photo = formData.get("president_photo");
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadFile(supabase, "public-files", "settings", photo);
    if ("error" in up) return { error: `Photo : ${up.error}`, values };
    photo_path = up.path;
  }

  // Conserve la photo existante si aucun nouveau fichier
  const { data: existing } = await supabase.from("site_settings").select("value").eq("key", "president").maybeSingle();
  const previousPhoto = ((existing?.value ?? {}) as { photo_path?: string }).photo_path ?? "";

  const rows = [
    { key: "contact", value: { email: d.contact_email, phones: d.contact_phones.split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean), address: d.contact_address } },
    { key: "social", value: { facebook: d.facebook, instagram: d.instagram, tiktok: d.tiktok, linkedin: d.linkedin, youtube: d.youtube, whatsapp: d.whatsapp } },
    { key: "president", value: { name: d.president_name, message: d.president_message, vision: d.president_vision, priorities: d.president_priorities, actions: d.president_actions, commitments: d.president_commitments, photo_path: photo_path ?? previousPhoto } },
    { key: "press", value: { contact: d.press_contact } },
    { key: "legal", value: { registry_number: d.legal_registry_number, publication_director: d.legal_publication_director, host: d.legal_host, retention: d.legal_retention } },
  ].map((r) => ({ ...r, updated_by: user.id, updated_at: new Date().toISOString() }));

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return { error: "Enregistrement refusé : " + error.message, values };
  await audit(supabase, { id: user.id, email: user.email ?? null }, "update", "site_settings", null);
  revalidatePath("/", "layout");
  redirect(`/admin/parametres${flashQuery("saved")}`);
}
