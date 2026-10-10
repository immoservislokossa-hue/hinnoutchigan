import type { Metadata } from "next";
import { Shell } from "@/components/admin/Shell";
import { requireUser } from "@/lib/auth";
import { isAdminRole, isCoordinator } from "@/lib/roles";
import type { NavItem } from "@/components/admin/NavLinks";

export const metadata: Metadata = { title: { default: "Espace membre", template: "%s · Espace membre SJB" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser("/espace");
  const nav: NavItem[] = [
    { href: "/espace", label: "Accueil" },
    { href: "/espace/profil", label: "Mon profil" },
    { href: "/espace/carte", label: "Ma carte" },
    { href: "/espace/documents", label: "Documents" },
    { href: "/espace/annonces", label: "Annonces" },
    { href: "/espace/rapports", label: "Mes rapports" },
  ];
  if (isCoordinator(profile.role)) nav.push({ href: "/espace/equipe", label: "Mon équipe" });
  if (isCoordinator(profile.role) || profile.role === "ben") nav.push({ href: "/espace/clause", label: "Clause d'engagement" });
  return (
    <Shell area="espace" profile={profile} nav={nav} switchTo={isAdminRole(profile.role) ? { href: "/admin", label: "Back-office" } : undefined}>
      {children}
    </Shell>
  );
}
