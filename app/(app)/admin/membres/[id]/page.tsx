import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Flash, PageHeader } from "@/components/admin/ui";
import { ResourceForm, SubmitButton } from "@/components/admin/ResourceForm";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES, MEMBER_STATUS_LABELS, ROLE_LABELS } from "@/lib/roles";
import { deptOptions, regionOptions, type Field } from "@/lib/admin/resources";
import { saveMemberAction, verifyClauseAction } from "@/lib/admin/special-actions";
import { formatDate } from "@/lib/data";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function MemberPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID.test(id)) notFound();
  const { profile: me } = await requireRoles(LEADERSHIP_ROLES);
  const supabase = await createClient();
  const [{ data: m }, { data: clause }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("clauses").select("*").eq("profile_id", id).maybeSingle(),
  ]);
  if (!m) notFound();

  const fields: Field[] = [
    { name: "full_name", label: "Prénoms et nom", type: "text", required: true, maxLength: 160 },
    { name: "phone", label: "Téléphone", type: "text", half: true, maxLength: 30 },
    { name: "sex", label: "Sexe", type: "select", half: true, options: [{ value: "F", label: "Féminin" }, { value: "M", label: "Masculin" }] },
    { name: "birth_date", label: "Date de naissance", type: "date", half: true },
    { name: "member_status", label: "Statut de membre", type: "select", required: true, half: true, options: Object.entries(MEMBER_STATUS_LABELS).map(([value, label]) => ({ value, label })), help: "Passer à « adhérent engagé » attribue le numéro de membre." },
    { name: "subgroup", label: "Sous-groupe", type: "select", half: true, options: [{ value: "CCJ", label: "CCJ (moins de 25 ans)" }, { value: "CLAP", label: "CLAP (26 à 34 ans)" }, { value: "CSM", label: "CSM (35 ans et plus)" }] },
    { name: "post", label: "Poste", type: "text", half: true, maxLength: 120, placeholder: "ex. Président(e), Trésorier(ère) Général(e)" },
    { name: "department_slug", label: "Département", type: "select", half: true, options: deptOptions },
    { name: "region", label: "Région", type: "select", half: true, options: regionOptions, help: "Déduite du département si vide." },
    { name: "status", label: "Compte", type: "select", required: true, half: true, options: [{ value: "active", label: "Actif" }, { value: "suspended", label: "Suspendu" }] },
    ...(me.role === "super_admin"
      ? ([{ name: "role", label: "Rôle", type: "select", required: true, half: true, options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })) }] as Field[])
      : []),
  ];
  const initial: Record<string, string> = {};
  for (const f of fields) initial[f.name] = (m as Record<string, unknown>)[f.name] == null ? "" : String((m as Record<string, unknown>)[f.name]);

  return (
    <>
      <PageHeader title={(m.full_name as string) || (m.email as string)} description={m.email as string} actions={<Link href="/admin/membres" className="link-arrow">← Retour</Link>} />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone="green">{ROLE_LABELS[m.role as keyof typeof ROLE_LABELS]}</Badge>
        {m.member_number && <Badge>{m.member_number as string}</Badge>}
        {m.status === "suspended" && <Badge tone="red">Suspendu</Badge>}
        <span className="text-xs text-ink-mute">Compte créé le {formatDate(m.created_at as string)}</span>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <ResourceForm fields={fields} initial={initial} action={saveMemberAction.bind(null, id)} cancelHref="/admin/membres" />
        <Card title="Clause d'engagement">
          {clause ? (
            <div className="space-y-3 text-sm text-ink-soft">
              <p>
                Déposée le {formatDate(clause.uploaded_at as string)} · {clause.verified ? <Badge tone="green">Vérifiée</Badge> : <Badge tone="gold">À vérifier</Badge>}
              </p>
              <a href={`/admin/fichier?path=${encodeURIComponent(clause.file_path as string)}`} target="_blank" rel="noopener noreferrer" className="link-arrow">
                Ouvrir le document
              </a>
              {!clause.verified && (
                <form action={verifyClauseAction.bind(null, id)}>
                  <SubmitButton>Marquer comme vérifiée</SubmitButton>
                </form>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Aucune clause déposée. Les responsables d&apos;instances déconcentrées doivent la transmettre dans les 15 jours suivant leur nomination (décret n°002-08-2026, art. 8).</p>
          )}
        </Card>
      </div>
    </>
  );
}
