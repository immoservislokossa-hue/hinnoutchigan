import { PageHeader } from "@/components/admin/ui";
import { Logo } from "@/components/ui/Logo";
import { requireUser } from "@/lib/auth";
import { MEMBER_STATUS_LABELS } from "@/lib/roles";
import { departments } from "@/content/structure";

export const metadata = { title: "Ma carte de membre" };

export default async function CardPage() {
  const { profile } = await requireUser("/espace/carte");
  const dept = departments.find((d) => d.slug === profile.department_slug);
  const valid = !!profile.member_number && profile.status === "active";
  return (
    <>
      <PageHeader title="Ma carte de membre" description={valid ? "Présentez cette carte lors des activités du SJB." : "Votre carte sera disponible dès la validation de votre adhésion en Assemblée Plénière."} />
      {valid && (
        <div className="max-w-md">
          <div className="overflow-hidden rounded-3xl border border-green-800 bg-white shadow-[0_24px_48px_-28px_rgb(8_38_19/0.5)]">
            <div className="flex items-center gap-3 bg-green-800 px-6 py-4 text-white">
              <span className="block h-12 w-12 overflow-hidden rounded-full bg-white"><Logo size={96} className="h-full w-full object-cover" /></span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold tracking-tight">Sénat des Jeunes du Bénin</p>
                <p className="text-xs text-white/75">Carte de membre · Toujours là, tel le soleil</p>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs text-ink-mute">Prénoms et nom</p>
                <p className="font-display text-2xl font-semibold tracking-tight text-green-900">{profile.full_name}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-xs text-ink-mute">N° de membre</dt><dd className="font-semibold text-green-900">{profile.member_number}</dd></div>
                <div><dt className="text-xs text-ink-mute">Statut</dt><dd className="font-semibold text-green-900">{MEMBER_STATUS_LABELS[profile.member_status]}</dd></div>
                {profile.subgroup && <div><dt className="text-xs text-ink-mute">Sous-groupe</dt><dd className="font-semibold text-green-900">{profile.subgroup}</dd></div>}
                {dept && <div><dt className="text-xs text-ink-mute">Département</dt><dd className="font-semibold text-green-900">{dept.name}</dd></div>}
                {profile.post && <div className="col-span-2"><dt className="text-xs text-ink-mute">Poste</dt><dd className="font-semibold text-green-900">{profile.post}</dd></div>}
              </dl>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-mute">Astuce : faites une capture d&apos;écran pour l&apos;avoir toujours avec vous.</p>
        </div>
      )}
    </>
  );
}
