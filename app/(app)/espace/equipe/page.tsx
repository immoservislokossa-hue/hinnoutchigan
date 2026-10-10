import { redirect } from "next/navigation";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MEMBER_STATUS_LABELS, ROLE_LABELS, isCoordinator, type AppRole } from "@/lib/roles";

export const metadata = { title: "Mon équipe" };

export default async function TeamPage() {
  const { profile } = await requireUser("/espace/equipe");
  if (!isCoordinator(profile.role)) redirect("/espace");
  const supabase = await createClient();
  // La RLS limite déjà la liste au périmètre de l'utilisateur
  const { data } = await supabase.from("profiles").select("id,full_name,email,phone,role,post,member_status,department_slug").neq("id", profile.id).order("full_name").limit(300);
  return (
    <>
      <PageHeader title="Mon équipe" description="Membres rattachés à votre périmètre. Données réservées à l'usage de l'association." />
      {!data || data.length === 0 ? (
        <EmptyState>Aucun membre dans votre périmètre pour le moment.</EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {data.map((m) => (
            <li key={m.id as string} className="card-lux p-4 sm:p-5">
              <p className="font-semibold text-green-900">{(m.full_name as string) || "Sans nom"}</p>
              <p className="mt-1 flex flex-wrap gap-1.5">
                <Badge tone="green">{ROLE_LABELS[m.role as AppRole]}</Badge>
                <Badge>{MEMBER_STATUS_LABELS[m.member_status as string]}</Badge>
              </p>
              {m.post ? <p className="mt-2 text-sm text-ink-soft">{m.post as string}</p> : null}
              <p className="mt-2 text-sm">
                {m.phone ? <a href={`tel:${String(m.phone).replace(/\s/g, "")}`} className="text-green-800 underline">{m.phone as string}</a> : <span className="text-ink-mute">Pas de téléphone</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
