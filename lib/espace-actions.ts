"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { departments } from "@/content/structure";
import { audit, flashQuery, isIsoDate, uploadFile } from "@/lib/admin/util";
import type { FormState } from "@/lib/admin/actions";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Le nom est obligatoire.").max(160),
  phone: z.string().trim().max(30),
  sex: z.enum(["F", "M", ""]),
  birth_date: z.string().trim(),
  bio: z.string().trim().max(1500),
});

/** Mise à jour de son propre profil (les champs sensibles sont protégés par la base de données). */
export async function saveProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser("/espace/profil");
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const d = parsed.data;
  if (d.birth_date && !isIsoDate(d.birth_date)) return { error: "Date de naissance invalide.", values };

  const supabase = await createClient();
  const update: Record<string, unknown> = { full_name: d.full_name, phone: d.phone || null, sex: d.sex || null, birth_date: d.birth_date || null, bio: d.bio || null };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadFile(supabase, "private-files", user.id, photo);
    if ("error" in up) return { error: `Photo : ${up.error}`, values };
    update.photo_path = up.path;
  }
  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return { error: "Enregistrement refusé : " + error.message, values };
  redirect(`/espace/profil${flashQuery("saved")}`);
}

const reportSchema = z.object({
  title: z.string().trim().min(3, "Le titre est obligatoire.").max(200),
  period_label: z.string().trim().min(2, "Indiquez la période (ex. Octobre 2026).").max(80),
  department_slug: z.string().trim(),
  content: z.string().trim().min(20, "Détaillez votre rapport (20 caractères minimum).").max(20000),
});

export async function saveReportAction(id: string | null, submit: boolean, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user, profile } = await requireUser("/espace/rapports");
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = reportSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const d = parsed.data;
  const dept = d.department_slug ? departments.find((x) => x.slug === d.department_slug)?.slug : (profile.department_slug ?? undefined);
  if (d.department_slug && !dept) return { error: "Département inconnu.", values };

  const supabase = await createClient();
  const wantsSubmit = submit || formData.get("intent") === "submit";
  const row = {
    title: d.title, period_label: d.period_label, content: d.content, department_slug: dept ?? null,
    status: wantsSubmit ? "submitted" : "draft", submitted_at: wantsSubmit ? new Date().toISOString() : null,
  };
  let entityId = id;
  if (id) {
    const { error, count } = await supabase.from("reports").update(row, { count: "exact" }).eq("id", id).eq("author_id", user.id);
    if (error || !count) return { error: "Ce rapport ne peut plus être modifié (déjà soumis ?).", values };
  } else {
    const { data, error } = await supabase.from("reports").insert({ ...row, author_id: user.id }).select("id").single();
    if (error) return { error: "Enregistrement refusé : " + error.message, values };
    entityId = data.id as string;
  }
  await audit(supabase, { id: user.id, email: user.email ?? null }, wantsSubmit ? "submit" : "save", "reports", entityId);
  redirect(`/espace/rapports${flashQuery(wantsSubmit ? "submitted" : "saved")}`);
}

export async function deleteReportAction(id: string) {
  const { user } = await requireUser("/espace/rapports");
  const supabase = await createClient();
  await supabase.from("reports").delete().eq("id", id).eq("author_id", user.id).eq("status", "draft");
  redirect(`/espace/rapports${flashQuery("deleted")}`);
}

export async function uploadClauseAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser("/espace/clause");
  const file = formData.get("file");
  const signedOn = String(formData.get("signed_on") ?? "");
  if (!(file instanceof File) || file.size === 0) return { error: "Choisissez le fichier signé (scan ou photo)." };
  if (signedOn && !isIsoDate(signedOn)) return { error: "Date invalide." };
  const supabase = await createClient();
  const up = await uploadFile(supabase, "private-files", user.id, file);
  if ("error" in up) return { error: up.error };
  const { error } = await supabase.from("clauses").upsert({ profile_id: user.id, file_path: up.path, signed_on: signedOn || null, uploaded_at: new Date().toISOString(), verified: false }, { onConflict: "profile_id" });
  if (error) return { error: "Dépôt refusé : " + error.message };
  await audit(supabase, { id: user.id, email: user.email ?? null }, "upload", "clauses", user.id);
  redirect(`/espace/clause${flashQuery("saved")}`);
}
