import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { actions } from "@/content/structure";

export const metadata: Metadata = {
  title: "Actions & projets",
  description: "Académie Citoyenne de Leadership, Comités de Paix et de Cohésion, éducation, santé, actions sociales : les actions du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/actions" },
};

export default function ActionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Actions & projets"
        crumbs={[{ label: "Actions" }]}
        title="Ce que le SJB fait pour la jeunesse"
        lede="Projets nationaux et actions territoriales, portés par les coordinations et les sections du SJB, au plus près des besoins des jeunes."
      />
      <section className="section-y">
        <div className="container-sjb">
          <ul className="grid gap-6 md:grid-cols-2">
            {actions.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 2) * 110}>
                <article className="card-lux flex h-full flex-col p-10">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-[0.64rem] uppercase tracking-[0.28em] text-gold-600">{a.tag}</p>
                    <span className="font-display text-3xl font-semibold text-gold-400/70">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="h-display mt-5 text-2xl text-green-900">{a.title}</h2>
                  <p className="mt-4 flex-1 text-ink-soft">{a.text}</p>
                  <p className="mt-7 border-t border-cream-300 pt-5 text-sm text-ink-mute">
                    Bilan, calendrier et résultats : <Todo what="à publier par le BEN" />
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="surface-dark on-dark section-y">
        <div className="container-sjb">
          <SectionHeading dark align="center" eyebrow="Une idée ? Un projet ?" title="Proposez, nous étudions" lede="Les jeunes sont au cœur de nos actions : partagez votre idée ou rejoignez un projet existant." />
          <Reveal className="mt-12 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/engagement" variant="gold">
              Je veux m&apos;engager
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Nous écrire
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
