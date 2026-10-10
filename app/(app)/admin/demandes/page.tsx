import Link from "next/link";
import { Badge, EmptyState, Flash, PageHeader, Pagination } from "@/components/admin/ui";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES } from "@/lib/roles";
import { formatDateTime } from "@/lib/data";
import { KIND_LABELS, STATUS_LABELS, STATUS_TONES, summarize } from "@/lib/admin/submissions";

export const metadata = { title: "Demandes" };
const PAGE = 20;

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string; page?: string; ok?: string; error?: string }> }) {
  const sp = await searchParams;
  await requireRoles(LEADERSHIP_ROLES);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const supabase = await createClient();
  let q = supabase.from("form_submissions").select("id,kind,payload,status,created_at", { count: "exact" }).order("created_at", { ascending: false });
  if (sp.kind && sp.kind in KIND_LABELS) q = q.eq("kind", sp.kind);
  if (sp.status && sp.status in STATUS_LABELS) q = q.eq("status", sp.status);
  const { data, count, error } = await q.range((page - 1) * PAGE, page * PAGE - 1);

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const next = { kind: sp.kind, status: sp.status, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin/demandes${s ? `?${s}` : ""}`;
  };
  const chip = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${active ? "bg-green-800 text-white" : "bg-cream-100 text-ink hover:bg-green-50"}`;

  return (
    <>
      <PageHeader title="Demandes reçues" description="Adhésions, engagements, partenariats, messages et demandes de presse envoyés depuis le site." />
      <Flash ok={sp.ok} error={sp.error ?? (error ? error.message : undefined)} />
      <div className="mb-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={link({ kind: undefined })} className={chip(!sp.kind)}>Tous types</Link>
        {Object.entries(KIND_LABELS).map(([k, l]) => (
          <Link key={k} href={link({ kind: k, page: undefined })} className={chip(sp.kind === k)}>{l}</Link>
        ))}
      </div>
      <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={link({ status: undefined })} className={chip(!sp.status)}>Tous statuts</Link>
        {Object.entries(STATUS_LABELS).map(([k, l]) => (
          <Link key={k} href={link({ status: k, page: undefined })} className={chip(sp.status === k)}>{l}</Link>
        ))}
      </div>

      {!data || data.length === 0 ? (
        <EmptyState>Aucune demande.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {data.map((r) => {
            const s = summarize(r.kind as string, r.payload as Record<string, string>);
            return (
              <li key={r.id as string}>
                <Link href={`/admin/demandes/${r.id}`} className="card-lux block p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={STATUS_TONES[r.status as string]}>{STATUS_LABELS[r.status as string]}</Badge>
                    <Badge>{KIND_LABELS[r.kind as string]}</Badge>
                    <span className="text-xs text-ink-mute">{formatDateTime(r.created_at as string)}</span>
                  </div>
                  <p className="mt-3 font-semibold text-green-900">{s.title}</p>
                  {s.subtitle && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{s.subtitle}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Pagination base={link({})} page={page} total={count ?? 0} size={PAGE} />
    </>
  );
}
