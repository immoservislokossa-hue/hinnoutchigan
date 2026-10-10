import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Flash, PageHeader } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/ResourceForm";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES } from "@/lib/roles";
import { formatDateTime } from "@/lib/data";
import { updateSubmissionAction } from "@/lib/admin/special-actions";
import { FIELD_LABELS, KIND_LABELS, STATUS_LABELS, STATUS_TONES, summarize } from "@/lib/admin/submissions";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SubmissionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID.test(id)) notFound();
  await requireRoles(LEADERSHIP_ROLES);
  const supabase = await createClient();
  const { data: row } = await supabase.from("form_submissions").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  const payload = row.payload as Record<string, string>;
  const s = summarize(row.kind as string, payload);

  return (
    <>
      <PageHeader title={s.title} description={KIND_LABELS[row.kind as string]} actions={<Link href="/admin/demandes" className="link-arrow">← Retour</Link>} />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title="Contenu de la demande">
          <p className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-mute">
            <Badge tone={STATUS_TONES[row.status as string]}>{STATUS_LABELS[row.status as string]}</Badge>
            Reçue le {formatDateTime(row.created_at as string)}
          </p>
          <dl className="divide-y divide-cream-300">
            {Object.entries(payload)
              .filter(([k, v]) => v && k !== "website")
              .map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                  <dt className="text-sm text-ink-mute">{FIELD_LABELS[k] ?? k}</dt>
                  <dd className="whitespace-pre-line break-words text-ink">
                    {k === "email" ? <a className="text-green-800 underline" href={`mailto:${v}`}>{v}</a> : k === "telephone" ? <a className="text-green-800 underline" href={`tel:${v.replace(/\s/g, "")}`}>{v}</a> : v}
                  </dd>
                </div>
              ))}
          </dl>
        </Card>

        <Card title="Suivi">
          <form action={updateSubmissionAction.bind(null, id)} className="space-y-5">
            <div>
              <label htmlFor="status" className="field-label">Statut</label>
              <select id="status" name="status" defaultValue={row.status as string} className="field">
                {Object.entries(STATUS_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="field-label">Notes internes</label>
              <textarea id="notes" name="notes" rows={6} defaultValue={(row.notes as string | null) ?? ""} maxLength={4000} className="field" />
            </div>
            <SubmitButton>Enregistrer</SubmitButton>
          </form>
          {row.kind === "adhesion" && (
            <div className="mt-6 border-t border-cream-300 pt-5 text-sm text-ink-soft">
              <p>Après validation en Assemblée Plénière, créez le compte du membre :</p>
              <Link
                href={`/admin/membres/inviter?email=${encodeURIComponent(payload.email ?? "")}&name=${encodeURIComponent([payload.prenom, payload.nom].filter(Boolean).join(" "))}`}
                className="link-arrow mt-3"
              >
                Inviter ce candidat
              </Link>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
