import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader, Flash } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canRead, canWrite, getResource } from "@/lib/admin/resources";
import { deleteResourceAction, saveResourceAction } from "@/lib/admin/actions";
import { toLocalInput } from "@/lib/admin/util";
import { publicFileUrl } from "@/lib/data";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { resource, id } = await params;
  const sp = await searchParams;
  const res = getResource(resource);
  if (!res || !UUID.test(id)) notFound();
  const { profile } = await requireAdmin(`/admin/${resource}/${id}`);
  if (!canRead(res, profile.role)) redirect("/admin");

  const supabase = await createClient();
  const { data: row } = await supabase.from(res.table).select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  const rec = row as Record<string, unknown>;

  const initial: Record<string, string> = {};
  for (const f of res.fields) {
    const v = rec[f.name];
    if (f.type === "file") continue;
    initial[f.name] = f.type === "checkbox" ? (v ? "on" : "") : f.type === "datetime" ? toLocalInput(v as string | null) : v == null ? "" : String(v);
  }

  const fileHints: Record<string, React.ReactNode> = {};
  for (const f of res.fields.filter((x) => x.type === "file")) {
    const path = rec[f.name] as string | null;
    if (!path) continue;
    const isPublic = f.bucket === "public-files" || (f.bucket === "by-visibility" && rec.visibility === "public");
    const href = isPublic ? publicFileUrl(path) : `/admin/fichier?path=${encodeURIComponent(path)}`;
    fileHints[f.name] = (
      <p className="mt-1.5 text-xs text-ink-mute">
        Fichier actuel :{" "}
        <a href={href ?? "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-green-800 underline">
          ouvrir
        </a>
        . Choisissez un nouveau fichier pour le remplacer.
      </p>
    );
  }

  const writable = canWrite(res, profile.role);
  const fields = profile.role === "coord_dept" ? res.fields.filter((f) => !f.lockToDepartment && !(res.key === "equipes" && f.name === "scope")) : res.fields;
  const title = String(rec[res.titleField] ?? res.singular);

  return (
    <>
      <PageHeader title={title} description={res.label} actions={<Link href={`/admin/${res.key}`} className="link-arrow">← Retour à la liste</Link>} />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="max-w-3xl space-y-8">
        {writable ? (
          <ResourceForm fields={fields} initial={initial} action={saveResourceAction.bind(null, res.key, id)} cancelHref={`/admin/${res.key}`} fileHints={fileHints} />
        ) : (
          <p className="rounded-2xl bg-cream-100 p-4 text-ink-soft">Lecture seule : vous n&apos;avez pas le droit de modifier cet élément.</p>
        )}
        {writable && res.canDelete && (
          <div className="border-t border-cream-300 pt-6">
            <ConfirmDelete action={deleteResourceAction.bind(null, res.key, id)} message={`Supprimer « ${title} » définitivement ?`} />
          </div>
        )}
      </div>
    </>
  );
}
