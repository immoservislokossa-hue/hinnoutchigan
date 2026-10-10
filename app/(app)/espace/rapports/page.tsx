import Link from "next/link";
import { Badge, EmptyState, Flash, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";

export const metadata = { title: "Mes rapports" };

const STATUS: Record<string, { label: string; tone: "neutral" | "green" | "gold" }> = {
  draft: { label: "Brouillon", tone: "neutral" },
  submitted: { label: "Soumis", tone: "gold" },
  reviewed: { label: "Examiné", tone: "green" },
};

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const sp = await searchParams;
  const { profile } = await requireUser("/espace/rapports");
  const supabase = await createClient();
  const { data } = await supabase.from("reports").select("id,title,period_label,status,created_at,submitted_at,feedback").eq("author_id", profile.id).order("created_at", { ascending: false }).limit(100);
  return (
    <>
      <PageHeader
        title="Mes rapports d'activité"
        description="Rédigez vos rapports mensuels ou trimestriels et transmettez-les à votre responsable."
        actions={<Link href="/espace/rapports/nouveau" className="btn btn-sm"><span>Nouveau rapport</span><span className="btn-arrow" aria-hidden="true" /></Link>}
      />
      <Flash ok={sp.ok} error={sp.error} />
      {!data || data.length === 0 ? (
        <EmptyState>Aucun rapport pour le moment.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {data.map((r) => (
            <li key={r.id as string}>
              <Link href={`/espace/rapports/${r.id}`} className="card-lux block p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={STATUS[r.status as string].tone}>{STATUS[r.status as string].label}</Badge>
                  <span className="text-xs text-ink-mute">{r.period_label as string} · {formatDate(r.created_at as string)}</span>
                </div>
                <p className="mt-2 font-semibold text-green-900">{r.title as string}</p>
                {r.feedback ? <p className="mt-2 line-clamp-2 rounded-xl bg-green-50 px-3 py-2 text-sm text-ink-soft">Retour : {r.feedback as string}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
