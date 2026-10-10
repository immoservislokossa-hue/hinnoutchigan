import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isLeadershipRole, isStaffRole, ROLE_LABELS } from "@/lib/roles";
import { departments } from "@/content/structure";

export const metadata = { title: "Tableau de bord" };

async function count(table: string, filter?: (q: any) => any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const supabase = await createClient();
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const { profile } = await requireAdmin();
  const leadership = isLeadershipRole(profile.role);
  const staff = isStaffRole(profile.role);
  const supabase = await createClient();

  const [newSubs, drafts, upcoming, subscribers, reportsToReview, members] = await Promise.all([
    leadership ? count("form_submissions", (q) => q.eq("status", "new")) : Promise.resolve(0),
    staff ? count("news_posts", (q) => q.eq("published", false)) : Promise.resolve(0),
    count("events", (q) => q.gte("starts_at", new Date().toISOString())),
    leadership ? count("newsletter_subscribers") : Promise.resolve(0),
    count("reports", (q) => q.eq("status", "submitted")),
    leadership ? count("profiles") : Promise.resolve(0),
  ]);

  let byDept: { slug: string; n: number }[] = [];
  if (leadership) {
    const { data } = await supabase.from("profiles").select("department_slug").not("department_slug", "is", null).limit(5000);
    const map = new Map<string, number>();
    for (const r of data ?? []) map.set(r.department_slug as string, (map.get(r.department_slug as string) ?? 0) + 1);
    byDept = [...map.entries()].map(([slug, n]) => ({ slug, n })).sort((a, b) => b.n - a.n);
  }

  const tiles = [
    leadership && { label: "Demandes à traiter", value: newSubs, href: "/admin/demandes?status=new", hot: newSubs > 0 },
    reportsToReview !== undefined && { label: "Rapports à examiner", value: reportsToReview, href: "/admin/rapports" },
    staff && { label: "Actualités en brouillon", value: drafts, href: "/admin/actualites" },
    { label: "Événements à venir", value: upcoming, href: "/admin/evenements" },
    leadership && { label: "Membres et comptes", value: members, href: "/admin/membres" },
    leadership && { label: "Abonnés à la lettre", value: subscribers, href: "/admin/abonnes" },
  ].filter(Boolean) as { label: string; value: number; href: string; hot?: boolean }[];

  return (
    <>
      <PageHeader title={`Bonjour${profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`} description={`Connecté en tant que ${ROLE_LABELS[profile.role]}.`} />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="card-lux block h-full p-4 sm:p-6">
              <p className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${t.hot ? "text-flag-red" : "text-green-800"}`}>{t.value}</p>
              <p className="mt-2 text-sm text-ink-soft">{t.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      {leadership && (
        <Card title="Comptes par département" className="mt-8">
          {byDept.length === 0 ? (
            <p className="text-ink-soft">Aucun compte rattaché à un département pour le moment.</p>
          ) : (
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {byDept.map((d) => (
                <li key={d.slug} className="flex items-center justify-between border-b border-cream-300 py-2 text-sm">
                  <span>{departments.find((x) => x.slug === d.slug)?.name ?? d.slug}</span>
                  <span className="font-semibold text-green-800">{d.n}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </>
  );
}
