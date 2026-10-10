import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, EmptyState, Flash, PageHeader, Pagination, SearchBar, cleanQuery } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canRead, canWrite, getResource, type Column } from "@/lib/admin/resources";
import { formatDate, formatDateTime } from "@/lib/data";

const PAGE = 20;

function cell(col: Column, v: unknown) {
  if (v === null || v === undefined || v === "") return <span className="text-ink-mute">—</span>;
  switch (col.kind) {
    case "bool":
      return v ? <Badge tone="green">Oui</Badge> : <Badge>Non</Badge>;
    case "badge":
      return <Badge>{String(v)}</Badge>;
    case "date":
      return formatDate(String(v));
    case "datetime":
      return formatDateTime(String(v));
    default:
      return String(v);
  }
}

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }) {
  const r = getResource((await params).resource);
  return { title: r?.label ?? "Back-office" };
}

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ q?: string; page?: string; ok?: string; error?: string }>;
}) {
  const { resource } = await params;
  const sp = await searchParams;
  const res = getResource(resource);
  if (!res) notFound();
  const { profile } = await requireAdmin(`/admin/${resource}`);
  if (!canRead(res, profile.role)) redirect("/admin");

  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = cleanQuery(sp.q);
  const supabase = await createClient();
  let query = supabase.from(res.table).select("*", { count: "exact" }).order(res.orderBy.column, { ascending: res.orderBy.ascending });
  if (q) query = query.or(res.searchColumns.map((c) => `${c}.ilike.%${q}%`).join(","));
  // La coordination départementale ne voit que le contenu de son département
  if (profile.role === "coord_dept" && profile.department_slug) {
    if (res.table === "news_posts" || res.table === "events") query = query.eq("department_slug", profile.department_slug);
    if (res.table === "leadership") query = query.eq("scope", `dept:${profile.department_slug}`);
  }
  const { data, count, error } = await query.range((page - 1) * PAGE, page * PAGE - 1);
  const rows = (data ?? []) as Record<string, unknown>[];
  const writable = canWrite(res, profile.role);
  const [first, ...rest] = res.columns;

  return (
    <>
      <PageHeader
        title={res.label}
        description={res.description}
        actions={
          res.canCreate && writable ? (
            <Link href={`/admin/${res.key}/new`} className="btn btn-sm">
              <span>Ajouter</span>
              <span className="btn-arrow" aria-hidden="true" />
            </Link>
          ) : undefined
        }
      />
      <Flash ok={sp.ok} error={sp.error ?? (error ? "Lecture impossible : " + error.message : undefined)} />
      <SearchBar action={`/admin/${res.key}`} q={q} />

      {rows.length === 0 ? (
        <EmptyState>Aucun élément{q ? " pour cette recherche" : ""}.</EmptyState>
      ) : (
        <>
          {/* Mobile : cartes */}
          <ul className="space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={String(r.id)}>
                <Link href={`/admin/${res.key}/${r.id}`} className="card-lux block p-4">
                  <p className="font-semibold text-green-900">{String(r[first.key] ?? "Sans titre")}</p>
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                    {rest.map((c) => (
                      <div key={c.key} className="flex items-center gap-1.5">
                        <dt className="text-ink-mute">{c.label} :</dt>
                        <dd>{cell(c, r[c.key])}</dd>
                      </div>
                    ))}
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
          {/* Tablette et bureau : tableau */}
          <div className="hidden overflow-x-auto rounded-3xl border border-cream-300 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-100 text-ink-mute">
                <tr>
                  {res.columns.map((c) => (
                    <th key={c.key} scope="col" className="px-5 py-3 font-medium">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={String(r.id)} className="border-t border-cream-300 hover:bg-green-50/50">
                    {res.columns.map((c, i) => (
                      <td key={c.key} className="px-5 py-3.5 align-top">
                        {i === 0 ? (
                          <Link href={`/admin/${res.key}/${r.id}`} className="font-semibold text-green-900 underline decoration-gold-400 decoration-2 underline-offset-4">
                            {String(r[c.key] ?? "Sans titre")}
                          </Link>
                        ) : (
                          cell(c, r[c.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination base={`/admin/${res.key}${q ? `?q=${encodeURIComponent(q)}` : ""}`} page={page} total={count ?? 0} size={PAGE} />
        </>
      )}
    </>
  );
}
