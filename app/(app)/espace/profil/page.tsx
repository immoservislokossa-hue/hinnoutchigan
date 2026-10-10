import { Flash, PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requireUser } from "@/lib/auth";
import type { Field } from "@/lib/admin/resources";
import { saveProfileAction } from "@/lib/espace-actions";

export const metadata = { title: "Mon profil" };

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const sp = await searchParams;
  const { profile, user } = await requireUser("/espace/profil");
  const fields: Field[] = [
    { name: "full_name", label: "Prénoms et nom", type: "text", required: true, maxLength: 160 },
    { name: "phone", label: "Téléphone", type: "text", half: true, maxLength: 30 },
    { name: "sex", label: "Sexe", type: "select", half: true, options: [{ value: "F", label: "Féminin" }, { value: "M", label: "Masculin" }] },
    { name: "birth_date", label: "Date de naissance", type: "date", half: true },
    { name: "photo", label: "Photo", type: "file", bucket: "private-files", half: true, help: "Visible par vous et les responsables autorisés." },
    { name: "bio", label: "Présentation", type: "textarea", rows: 4, maxLength: 1500 },
  ];
  const initial = {
    full_name: profile.full_name, phone: profile.phone ?? "", sex: profile.sex ?? "", birth_date: profile.birth_date ?? "", bio: profile.bio ?? "",
  };
  return (
    <>
      <PageHeader title="Mon profil" description={`Compte : ${user.email ?? profile.email ?? ""}. Votre rôle, votre poste et votre rattachement sont gérés par le secrétariat.`} />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="max-w-2xl">
        <ResourceForm fields={fields} initial={initial} action={saveProfileAction} cancelHref="/espace" />
      </div>
    </>
  );
}
