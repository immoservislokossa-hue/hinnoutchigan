import type { SupabaseClient } from "@supabase/supabase-js";

const TZ = "Africa/Porto-Novo";

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** ISO → valeur d'un <input type="datetime-local"> à l'heure du Bénin (UTC+1). */
export function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  return parts.replace(" ", "T");
}

/** Valeur datetime-local (heure du Bénin) → ISO UTC. */
export function fromLocalInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00+01:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(v).getTime());

/* ------------------------------ Fichiers ------------------------------ */

export type Bucket = "public-files" | "private-files";

const LIMITS: Record<Bucket, number> = { "public-files": 10 * 1024 * 1024, "private-files": 15 * 1024 * 1024 };

const MIME_BY_BUCKET: Record<Bucket, string[]> = {
  "public-files": ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  "private-files": [
    "image/jpeg", "image/png", "image/webp", "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

/** Vérifie la signature réelle du fichier (et pas seulement l'extension ou le type déclaré). */
function sniff(bytes: Uint8Array): string | null {
  const h = (...b: number[]) => b.every((v, i) => bytes[i] === v);
  if (h(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (h(0x89, 0x50, 0x4e, 0x47)) return "image/png";
  if (h(0x25, 0x50, 0x44, 0x46)) return "application/pdf";
  if (h(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45) return "image/webp";
  if (h(0x50, 0x4b, 0x03, 0x04)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (h(0xd0, 0xcf, 0x11, 0xe0)) return "application/msword";
  return null;
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf", "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export async function uploadFile(
  supabase: SupabaseClient,
  bucket: Bucket,
  folder: string,
  file: File,
): Promise<{ path: string } | { error: string }> {
  if (file.size === 0) return { error: "Fichier vide." };
  if (file.size > LIMITS[bucket]) return { error: `Fichier trop volumineux (${Math.round(LIMITS[bucket] / 1048576)} Mo maximum).` };
  const buf = new Uint8Array(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type || !MIME_BY_BUCKET[bucket].includes(type)) {
    return { error: "Format non autorisé. Formats acceptés : JPG, PNG, WebP, PDF" + (bucket === "private-files" ? ", Word." : ".") };
  }
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier";
  const path = `${folder}/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}-${base}.${EXT[type]}`;
  const { error } = await supabase.storage.from(bucket).upload(path, buf, { contentType: type, upsert: false });
  if (error) return { error: "Téléversement impossible : " + error.message };
  return { path };
}

/* ------------------------------ Audit ------------------------------ */

export async function audit(
  supabase: SupabaseClient,
  actor: { id: string; email: string | null },
  action: string,
  entity: string,
  entityId: string | null,
  meta: Record<string, unknown> = {},
) {
  // Un échec d'audit ne doit jamais bloquer l'action elle-même
  await supabase.from("audit_log").insert({ actor_id: actor.id, actor_email: actor.email, action, entity, entity_id: entityId, meta });
}

export const flashQuery = (ok?: string, error?: string) => {
  const q = new URLSearchParams();
  if (ok) q.set("ok", ok);
  if (error) q.set("error", error.slice(0, 160));
  const s = q.toString();
  return s ? `?${s}` : "";
};
