import { PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requireRoles } from "@/lib/auth";
import { LEADERSHIP_ROLES, ROLE_LABELS } from "@/lib/roles";
import { deptOptions, type Field } from "@/lib/admin/resources";
import { inviteMemberAction } from "@/lib/admin/special-actions";

export const metadata = { title: "Inviter un membre" };

export default async function InvitePage({ searchParams }: { searchParams: Promise<{ email?: string; name?: string }> }) {
  const { profile } = await requireRoles(LEADERSHIP_ROLES);
  const sp = await searchParams;
  const allowed = Object.entries(ROLE_LABELS).filter(([k]) => profile.role === "super_admin" || ["member", "coord_region", "coord_dept", "communal", "arrondissement"].includes(k));
  const fields: Field[] = [
    { name: "full_name", label: "Prénoms et nom", type: "text", required: true, maxLength: 160 },
    { name: "email", label: "Adresse e-mail", type: "text", required: true, maxLength: 254, half: true },
    { name: "role", label: "Rôle", type: "select", required: true, half: true, options: allowed.map(([value, label]) => ({ value, label })) },
    { name: "department_slug", label: "Département de rattachement", type: "select", options: deptOptions, help: "Obligatoire pour les coordinations départementales, sections communales et d'arrondissement." },
  ];
  return (
    <>
      <PageHeader title="Inviter un membre" description="Un e-mail est envoyé pour choisir un mot de passe. Le compte n'est ouvert à personne d'autre." />
      <div className="max-w-2xl">
        <ResourceForm
          fields={fields}
          initial={{ email: sp.email ?? "", full_name: sp.name ?? "", role: "member" }}
          action={inviteMemberAction}
          cancelHref="/admin/membres"
          submitLabel="Envoyer l'invitation"
        />
      </div>
    </>
  );
}
