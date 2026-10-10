import { EmptyState, Flash, PageHeader, Pagination, SearchBar, cleanQuery } from "@/components/admin/ui";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES } from "@/lib/roles";
import { formatDate } from "@/lib/data";
import { deleteSubscriberAction } from "@/lib/admin/special-actions";

export const metadata = { title: "Abonnés" };
const PAGE = 30;

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; ok?: string; error?: string }> }) {
  const sp = await searchParams;
  await requireRoles(LEADERSHIP_ROLES);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = cleanQuery(sp.q);
  const supabase = await createClient();
  let query = supabase.from("newsletter_subscribers").select("id,email,source,created_at", { count: "exact" }).order("created_at", { ascending: false });
  if (q) query = query.ilike("email", `%${q}%`);
  const { data, count } = await query.range((page - 1) * PAGE, page * PAGE - 1);

  return (
    <>
      <PageHeader title="Abonnés à la lettre" description={`${count ?? 0} adresse(s) inscrite(s) depuis le site.`} actions={<a href="/admin/abonnes/export" download className="btn btn-sm btn-outline-dark"><span>Exporter en CSV</span><span className="btn-arrow" aria-hidden="true" /></a>} />
      <Flash ok={sp.ok} error={sp.error} />
      <SearchBar action="/admin/abonnes" q={q} placeholder="Adresse e-mail" />
      {!data || data.length === 0 ? (
        <EmptyState>Aucun abonné.</EmptyState>
      ) : (
        <ul className="divide-y divide-cream-300 rounded-3xl border border-cream-300">
          {data.map((s) => (
            <li key={s.id as string} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate font-medium text-green-900">{s.email as string}</p>
                <p className="text-xs text-ink-mute">{formatDate(s.created_at as string)} · {s.source as string}</p>
              </div>
              <ConfirmDelete action={deleteSubscriberAction.bind(null, s.id as string)} message={`Supprimer ${s.email} ?`} />
            </li>
          ))}
        </ul>
      )}
      <Pagination base={`/admin/abonnes${q ? `?q=${encodeURIComponent(q)}` : ""}`} page={page} total={count ?? 0} size={PAGE} />
    </>
  );
}
