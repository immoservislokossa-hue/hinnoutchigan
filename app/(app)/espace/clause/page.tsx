import { Badge, Card, Flash, PageHeader } from "@/components/admin/ui";
import { ClauseForm } from "@/components/admin/ClauseForm";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";

export const metadata = { title: "Clause d'engagement" };

export default async function ClausePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const sp = await searchParams;
  const { profile } = await requireUser("/espace/clause");
  const supabase = await createClient();
  const { data: clause } = await supabase.from("clauses").select("*").eq("profile_id", profile.id).maybeSingle();
  return (
    <>
      <PageHeader title="Clause d'engagement" description="Engagement de mission, de confidentialité et de réserve des responsables d'instances déconcentrées (décret n°002-08-2026, art. 8 et annexe)." />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
        <Card title="Mon dépôt">
          {clause ? (
            <div className="space-y-3 text-sm text-ink-soft">
              <p>Déposée le {formatDate(clause.uploaded_at as string)}</p>
              <p>{clause.verified ? <Badge tone="green">Vérifiée par le secrétariat</Badge> : <Badge tone="gold">En attente de vérification</Badge>}</p>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Aucune clause déposée. Elle doit être transmise dans les 15 jours suivant votre nomination : sans cela, la nomination est annulée après 30 jours.</p>
          )}
        </Card>
        {!clause?.verified && (
          <Card title={clause ? "Remplacer le fichier" : "Déposer ma clause"}>
            <ClauseForm />
          </Card>
        )}
      </div>
    </>
  );
}
