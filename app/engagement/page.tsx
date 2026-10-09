import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EngagementForm } from "@/components/forms/forms";

export const metadata: Metadata = {
  title: "Je veux m'engager",
  description: "Bénévole, formateur, expert, partenaire ou porteur de projet : proposez vos talents au Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/engagement" },
};

const roles = [
  ["Bénévole", "Donnez du temps lors des activités, campagnes et journées d'action."],
  ["Participant", "Prenez part aux formations, conférences et débats organisés près de chez vous."],
  ["Formateur ou expert", "Transmettez une compétence : numérique, entrepreneuriat, droit, santé…"],
  ["Porteur de projet", "Présentez une initiative locale que le SJB peut accompagner."],
];

export default function EngagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Je veux m'engager"
        crumbs={[{ label: "Rejoindre", href: "/rejoindre" }, { label: "M'engager" }]}
        title="Mettez vos talents au service de la jeunesse"
        lede="Dites-nous comment vous voulez agir : un responsable de votre territoire vous recontactera."
      />
      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Comment agir" title="Quatre façons de vous engager" />
            <ul className="mt-12 divide-y divide-cream-300 border-y border-cream-300">
              {roles.map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 80} className="py-6">
                  <h3 className="h-display text-lg text-green-900">{t}</h3>
                  <p className="mt-2 text-ink-soft">{d}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal>
            <EngagementForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
