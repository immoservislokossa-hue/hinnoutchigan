import Link from "next/link";
import { Badge, EmptyState, Flash, PageHeader, Pagination, SearchBar, cleanQuery } from "@/components/admin/ui";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES, MEMBER_STATUS_LABELS, ROLE_LABELS, type AppRole } from "@/lib/roles";
import { departments } from "@/content/structure";

export const metadata = { title: "Membres" };
const PAGE = 25;

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; dept?: string; page?: string; ok?: string; error?: string }> }) {
  const sp = await searchParams;
  await requireRoles(LEADERSHIP_ROLES);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = cleanQuery(sp.q);
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("id,full_name,email,role,status,member_status,department_slug,post,member_number", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,member_number.ilike.%${q}%`);
  if (sp.role && sp.role in ROLE_LABELS) query = query.eq("role", sp.role);
  if (sp.dept && departments.some((d) => d.slug === sp.dept)) query = query.eq("department_slug", sp.dept);
  const { data, count, error } = await query.range((page - 1) * PAGE, page * PAGE - 1);

  return (
    <>
      <PageHeader
        title="Membres et comptes"
        description="Comptes de l'espace membre, rôles et rattachement territorial."
        actions={
          <Link href="/admin/membres/inviter" className="btn btn-sm">
            <span>Inviter un membre</span>
            <span className="btn-arrow" aria-hidden="true" />
          </Link>
        }
      />
      <Flash ok={sp.ok} error={sp.error ?? error?.message} />
      <SearchBar action="/admin/membres" q={q} placeholder="Nom, e-mail ou n° de membre" />
      <form action="/admin/membres" className="mb-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        {q && <input type="hidden" name="q" value={q} />}
        <select name="role" defaultValue={sp.role ?? ""} className="field !py-2.5" aria-label="Filtrer par rôle">
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select name="dept" defaultValue={sp.dept ?? ""} className="field !py-2.5" aria-label="Filtrer par département">
          <option value="">Tous les départements</option>
          {departments.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </select>
        <button type="submit" className="rounded-xl border border-green-800 px-5 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-50">Filtrer</button>
      </form>

      {!data || data.length === 0 ? (
        <EmptyState>Aucun compte.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {data.map((m) => (
            <li key={m.id as string}>
              <Link href={`/admin/membres/${m.id}`} className="card-lux block p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-green-900">{(m.full_name as string) || "Sans nom"}</p>
                    <p className="truncate text-sm text-ink-mute">{m.email as string}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="green">{ROLE_LABELS[m.role as AppRole]}</Badge>
                    {m.status === "suspended" && <Badge tone="red">Suspendu</Badge>}
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {[MEMBER_STATUS_LABELS[m.member_status as string], m.post, departments.find((d) => d.slug === m.department_slug)?.name, m.member_number].filter(Boolean).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination base={`/admin/membres?${new URLSearchParams({ ...(q ? { q } : {}), ...(sp.role ? { role: sp.role } : {}), ...(sp.dept ? { dept: sp.dept } : {}) }).toString()}`} page={page} total={count ?? 0} size={PAGE} />
    </>
  );
}
