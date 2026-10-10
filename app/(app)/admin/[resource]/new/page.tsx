import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/auth";
import { canWrite, getResource } from "@/lib/admin/resources";
import { saveResourceAction } from "@/lib/admin/actions";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const res = getResource(resource);
  if (!res || !res.canCreate) notFound();
  const { profile } = await requireAdmin(`/admin/${resource}/new`);
  if (!canWrite(res, profile.role)) redirect(`/admin/${resource}`);

  const initial: Record<string, string> = {};
  if (profile.role === "coord_dept" && profile.department_slug) {
    initial.department_slug = profile.department_slug;
    initial.scope = `dept:${profile.department_slug}`;
  }
  // Les coordinations n'ont pas le choix du périmètre : champ retiré du formulaire
  const fields = profile.role === "coord_dept" ? res.fields.filter((f) => !f.lockToDepartment && !(res.key === "equipes" && f.name === "scope")) : res.fields;

  return (
    <>
      <PageHeader title={`Nouvelle ${res.singular}`} description={res.label} />
      <div className="max-w-3xl">
        <ResourceForm fields={fields} initial={initial} action={saveResourceAction.bind(null, res.key, null)} cancelHref={`/admin/${res.key}`} />
      </div>
    </>
  );
}
