"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getResource, canWrite, type Field, type Resource } from "@/lib/admin/resources";
import { audit, flashQuery, fromLocalInput, isIsoDate, slugify, uploadFile, type Bucket } from "@/lib/admin/util";

export type FormState = { error?: string; values?: Record<string, string>; nonce?: number };

const REVALIDATE = ["/", "/actualites", "/agenda", "/documents", "/partenaires", "/bureau-executif", "/presidence", "/territoires"];
function refreshPublicSite() {
  revalidatePath("/", "layout");
  for (const p of REVALIDATE) revalidatePath(p);
}

function rawValues(res: Resource, formData: FormData) {
  const out: Record<string, string> = {};
  for (const f of res.fields) {
    if (f.type === "file") continue;
    out[f.name] = f.type === "checkbox" ? (formData.get(f.name) ? "on" : "") : String(formData.get(f.name) ?? "");
  }
  return out;
}

function coerce(f: Field, raw: string): { value: unknown } | { error: string } {
  const v = raw.trim();
  if (f.type === "checkbox") return { value: v === "on" };
  if (!v) {
    if (f.required && f.type !== "slug") return { error: `« ${f.label} » est obligatoire.` };
    return { value: f.type === "number" ? 0 : f.type === "text" || f.type === "textarea" || f.type === "slug" ? (f.required ? "" : f.name === "excerpt" || f.name === "body" || f.name === "description" ? "" : null) : null };
  }
  if (f.maxLength && v.length > f.maxLength) return { error: `« ${f.label} » est trop long (${f.maxLength} caractères maximum).` };
  switch (f.type) {
    case "select":
      if (f.options && !f.options.some((o) => o.value === v)) return { error: `Valeur invalide pour « ${f.label} ».` };
      return { value: v };
    case "datetime": {
      const iso = fromLocalInput(v);
      return iso ? { value: iso } : { error: `Date et heure invalides pour « ${f.label} ».` };
    }
    case "date":
      return isIsoDate(v) ? { value: v } : { error: `Date invalide pour « ${f.label} ».` };
    case "number": {
      const n = Number.parseInt(v, 10);
      return Number.isFinite(n) && n >= -100000 && n <= 100000 ? { value: n } : { error: `Nombre invalide pour « ${f.label} ».` };
    }
    case "slug": {
      const s = slugify(v);
      return s ? { value: s } : { error: `Adresse (slug) invalide.` };
    }
    default:
      if (f.name === "url" && !/^https?:\/\/\S+$/i.test(v)) return { error: "Le site web doit commencer par http:// ou https://" };
      return { value: v };
  }
}

export async function saveResourceAction(key: string, id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const res = getResource(key);
  if (!res) return { error: "Ressource inconnue." };
  const { user, profile } = await requireUser(`/admin/${key}`);
  if (!canWrite(res, profile.role)) return { error: "Vous n'avez pas le droit de modifier cette ressource." };
  if (!id && !res.canCreate) return { error: "Création non autorisée." };

  const values = rawValues(res, formData);
  const record: Record<string, unknown> = {};

  for (const f of res.fields) {
    if (f.type === "file" || f.readOnly) continue;
    let raw = values[f.name];
    // Coordination départementale : périmètre imposé côté serveur
    if (profile.role === "coord_dept") {
      if (f.lockToDepartment) {
        if (!profile.department_slug) return { error: "Votre compte n'est rattaché à aucun département.", values };
        raw = profile.department_slug;
      }
      if (res.key === "equipes" && f.name === "scope") {
        if (!profile.department_slug) return { error: "Votre compte n'est rattaché à aucun département.", values };
        raw = `dept:${profile.department_slug}`;
        values.scope = raw;
      }
    }
    const c = coerce(f, raw);
    if ("error" in c) return { error: c.error, values };
    record[f.name] = c.value;
  }

  // Slug dérivé du titre, publication horodatée
  const slugField = res.fields.find((f) => f.type === "slug");
  if (slugField && !record[slugField.name]) {
    const s = slugify(String(record[slugField.source ?? "title"] ?? ""));
    if (!s) return { error: "Impossible de générer l'adresse : renseignez le titre.", values };
    record[slugField.name] = s;
  }
  if (res.table === "news_posts" && record.published && !record.published_at) record.published_at = new Date().toISOString();
  if (res.table === "announcements" && !record.published_at) record.published_at = new Date().toISOString();
  if (res.table === "reports" && record.status === "reviewed") record.reviewed_by = user.id;

  const supabase = await createClient();

  // Fichiers
  for (const f of res.fields.filter((x) => x.type === "file" && !x.readOnly)) {
    const file = formData.get(f.name);
    if (file instanceof File && file.size > 0) {
      const bucket: Bucket = f.bucket === "by-visibility" ? (record.visibility === "public" ? "public-files" : "private-files") : (f.bucket as Bucket);
      const up = await uploadFile(supabase, bucket, f.folder ?? "misc", file);
      if ("error" in up) return { error: `${f.label} : ${up.error}`, values };
      record[f.name] = up.path;
    } else if (!id && f.required) {
      return { error: `« ${f.label} » est obligatoire.`, values };
    }
  }

  let entityId = id;
  if (id) {
    const { error, count } = await supabase.from(res.table).update(record, { count: "exact" }).eq("id", id);
    if (error) return { error: dbMessage(error), values };
    if (!count) return { error: "Modification refusée ou élément introuvable.", values };
  } else {
    if (res.createdByColumn) record[res.createdByColumn] = user.id;
    const { data, error } = await supabase.from(res.table).insert(record).select("id").single();
    if (error) return { error: dbMessage(error), values };
    entityId = data.id as string;
  }

  await audit(supabase, { id: user.id, email: user.email ?? null }, id ? "update" : "create", res.table, entityId, { title: record[res.titleField] ?? null });
  refreshPublicSite();
  redirect(`/admin/${key}${flashQuery("saved")}`);
}

export async function deleteResourceAction(key: string, id: string) {
  const res = getResource(key);
  if (!res || !res.canDelete) redirect("/admin");
  const { user, profile } = await requireUser(`/admin/${key}`);
  if (!canWrite(res, profile.role)) redirect(`/admin/${key}${flashQuery(undefined, "Suppression non autorisée.")}`);
  const supabase = await createClient();
  const { error, count } = await supabase.from(res.table).delete({ count: "exact" }).eq("id", id);
  if (error || !count) redirect(`/admin/${key}${flashQuery(undefined, "Suppression refusée.")}`);
  await audit(supabase, { id: user.id, email: user.email ?? null }, "delete", res.table, id);
  refreshPublicSite();
  redirect(`/admin/${key}${flashQuery("deleted")}`);
}

function dbMessage(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Cette valeur existe déjà (adresse ou doublon).";
  if (error.code === "42501") return "Action refusée par les règles de sécurité.";
  if (error.code === "23514") return "Une valeur ne respecte pas le format attendu.";
  return "Enregistrement impossible : " + error.message;
}
