import type { Metadata } from "next";
import { Shell } from "@/components/admin/Shell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { resourceList, canRead } from "@/lib/admin/resources";
import { isLeadershipRole } from "@/lib/roles";
import type { NavItem } from "@/components/admin/NavLinks";

export const metadata: Metadata = { title: { default: "Back-office", template: "%s · Back-office SJB" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  const leadership = isLeadershipRole(profile.role);

  let newCount = 0;
  if (leadership) {
    const supabase = await createClient();
    const { count } = await supabase.from("form_submissions").select("id", { count: "exact", head: true }).eq("status", "new");
    newCount = count ?? 0;
  }

  const nav: NavItem[] = [{ href: "/admin", label: "Tableau de bord" }];
  if (leadership) nav.push({ href: "/admin/demandes", label: "Demandes", badge: newCount }, { href: "/admin/membres", label: "Membres" });
  for (const r of resourceList) if (canRead(r, profile.role)) nav.push({ href: `/admin/${r.key}`, label: r.label });
  if (leadership) nav.push({ href: "/admin/abonnes", label: "Abonnés" }, { href: "/admin/parametres", label: "Paramètres" });
  if (profile.role === "super_admin") nav.push({ href: "/admin/journal", label: "Journal" });

  return (
    <Shell area="admin" profile={profile} nav={nav} switchTo={{ href: "/espace", label: "Mon espace" }}>
      {children}
    </Shell>
  );
}
