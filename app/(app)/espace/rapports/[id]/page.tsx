import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { reportFields } from "@/lib/report-fields";
import { deleteReportAction, saveReportAction } from "@/lib/espace-actions";
import { formatDate } from "@/lib/data";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { profile } = await requireUser(`/espace/rapports/${id}`);
  const supabase = await createClient();
  const { data: r } = await supabase.from("reports").select("*").eq("id", id).eq("author_id", profile.id).maybeSingle();
  if (!r) notFound();
  const editable = r.status === "draft";

  return (
    <>
      <PageHeader title={r.title as string} description={`${r.period_label} · créé le ${formatDate(r.created_at as string)}`} actions={<Link href="/espace/rapports" className="link-arrow">← Mes rapports</Link>} />
      {editable ? (
        <div className="max-w-3xl space-y-8">
          <ResourceForm
            fields={reportFields}
            initial={{ title: r.title as string, period_label: r.period_label as string, department_slug: (r.department_slug as string) ?? "", content: r.content as string, intent: "draft" }}
            action={saveReportAction.bind(null, id, false)}
            cancelHref="/espace/rapports"
          />
          <div className="border-t border-cream-300 pt-6">
            <ConfirmDelete action={deleteReportAction.bind(null, id)} message="Supprimer ce brouillon ?" />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-5">
          <Badge tone={r.status === "reviewed" ? "green" : "gold"}>{r.status === "reviewed" ? "Examiné" : "Soumis"}</Badge>
          <Card title="Contenu"><p className="whitespace-pre-line text-ink-soft">{r.content as string}</p></Card>
          {r.feedback ? <Card title="Retour de votre responsable"><p className="whitespace-pre-line text-ink-soft">{r.feedback as string}</p></Card> : null}
        </div>
      )}
    </>
  );
}
