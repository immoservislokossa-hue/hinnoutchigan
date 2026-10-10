import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MEMBER_STATUS_LABELS, ROLE_LABELS } from "@/lib/roles";
import { departments } from "@/content/structure";
import { formatDate } from "@/lib/data";

export const metadata = { title: "Accueil" };

export default async function EspaceHome() {
  const { profile } = await requireUser("/espace");
  const supabase = await createClient();
  const [{ data: annonces }, { count: drafts }] = await Promise.all([
    supabase.from("announcements").select("id,title,published_at").order("published_at", { ascending: false }).limit(3),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("author_id", profile.id).eq("status", "draft"),
  ]);
  const dept = departments.find((d) => d.slug === profile.department_slug);
  const todo: string[] = [];
  if (!profile.full_name) todo.push("Renseignez votre nom dans votre profil.");
  if (!profile.phone) todo.push("Ajoutez votre numéro de téléphone.");
  if (profile.member_status === "candidat") todo.push("Votre adhésion n'est pas encore validée par l'Assemblée Plénière.");

  return (
    <>
      <PageHeader title={`Bonjour${profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`} description="Votre espace personnel au sein du Sénat des Jeunes du Bénin." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Mon statut">
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">{ROLE_LABELS[profile.role]}</Badge>
            <Badge>{MEMBER_STATUS_LABELS[profile.member_status]}</Badge>
            {profile.subgroup && <Badge>{profile.subgroup}</Badge>}
            {dept && <Badge>{dept.name}</Badge>}
          </div>
          {profile.post && <p className="mt-4 text-ink-soft">Poste : <strong className="text-green-900">{profile.post}</strong></p>}
          {profile.member_number && <p className="mt-1 text-ink-soft">N° de membre : <strong className="text-green-900">{profile.member_number}</strong></p>}
          {todo.length > 0 && (
            <ul className="mt-5 space-y-2 rounded-2xl bg-gold-200/30 p-4 text-sm text-ink-soft">
              {todo.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          )}
        </Card>

        <Card title="Dernières annonces">
          {annonces && annonces.length > 0 ? (
            <ul className="space-y-3">
              {annonces.map((a) => (
                <li key={a.id as string}>
                  <p className="font-medium text-green-900">{a.title as string}</p>
                  <p className="text-xs text-ink-mute">{formatDate(a.published_at as string)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">Aucune annonce pour le moment.</p>
          )}
          <Link href="/espace/annonces" className="link-arrow mt-4">Toutes les annonces</Link>
        </Card>

        <Card title="Mes rapports">
          <p className="text-ink-soft">{drafts ? `${drafts} brouillon(s) en cours.` : "Aucun brouillon en cours."}</p>
          <Link href="/espace/rapports/nouveau" className="link-arrow mt-4">Rédiger un rapport</Link>
        </Card>
      </div>
    </>
  );
}
