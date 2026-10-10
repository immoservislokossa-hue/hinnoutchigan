import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { PartnerForm } from "@/components/forms/forms";

export const metadata: Metadata = {
  title: "Partenaires · Devenir partenaire",
  description: "Institutions, entreprises, ONG et établissements : construisons un partenariat formalisé par convention avec le Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/partenaires" },
};

const principles = [
  ["Une convention signée", "Tout partenariat est formalisé par une convention signée par les deux parties."],
  ["L'information de l'Assemblée", "Chaque convention est soumise à l'information de l'Assemblée Plénière."],
  ["L'indépendance préservée", "Aucun partenariat ne saurait compromettre l'indépendance du SJB."],
  ["La neutralité partisane", "Le SJB ne s'associe à aucun parti ni à aucun candidat politique."],
];

export default function PartenairesPage() {
  return (
    <>
      <PageHero
        eyebrow="Partenaires"
        crumbs={[{ label: "Transparence", href: "/transparence" }, { label: "Partenaires" }]}
        title="Construire ensemble pour la jeunesse"
        lede="Associations, organisations, institutions et entreprises partageant notre vision peuvent renforcer nos capacités et élargir notre impact."
      />

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Ils nous font confiance" title="Nos partenaires" />
          <Reveal className="mt-12 border border-dashed border-cream-300 bg-cream-100 p-12 text-center">
            <p className="font-serif text-2xl text-ink-soft">
              <Todo what="logos et noms des partenaires conventionnés" />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Nos principes" title="Un partenariat clair et encadré" />
          <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {principles.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 90}>
                <div className="card-lux h-full p-8">
                  <p className="font-display text-3xl font-semibold text-green-700">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="h-display mt-5 text-lg text-green-900">{t}</h3>
                  <p className="mt-3 text-ink-soft">{d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <SectionHeading
            eyebrow="Devenir partenaire"
            title="Proposez une collaboration"
            lede="Précisez votre organisation, le type de partenariat souhaité et votre proposition. Le Bureau Exécutif National l'étudiera."
          />
          <Reveal>
            <PartnerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
