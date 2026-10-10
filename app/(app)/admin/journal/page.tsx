import { EmptyState, PageHeader, Pagination } from "@/components/admin/ui";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/data";

export const metadata = { title: "Journal d'audit" };
const PAGE = 40;

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  await requireRoles(["super_admin"]);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const supabase = await createClient();
  const { data, count } = await supabase.from("audit_log").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * PAGE, page * PAGE - 1);
  return (
    <>
      <PageHeader title="Journal d'audit" description="Qui a fait quoi, et quand. Visible par l'administrateur principal uniquement." />
      {!data || data.length === 0 ? (
        <EmptyState>Aucune action enregistrée.</EmptyState>
      ) : (
        <ul className="divide-y divide-cream-300 rounded-3xl border border-cream-300">
          {data.map((r) => (
            <li key={r.id as number} className="px-4 py-3 text-sm sm:px-6">
              <p className="text-ink">
                <span className="font-semibold text-green-900">{(r.actor_email as string) ?? "système"}</span> · {r.action as string} · {r.entity as string}
              </p>
              <p className="text-xs text-ink-mute">{formatDateTime(r.created_at as string)}{r.meta && Object.keys(r.meta as object).length ? ` · ${JSON.stringify(r.meta)}` : ""}</p>
            </li>
          ))}
        </ul>
      )}
      <Pagination base="/admin/journal" page={page} total={count ?? 0} size={PAGE} />
    </>
  );
}
