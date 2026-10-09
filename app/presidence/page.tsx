import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Portrait } from "@/components/ui/Portrait";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";
import { benPosts } from "@/content/structure";

export const metadata: Metadata = {
  title: "Présidence",
  description: "Le Président du Sénat des Jeunes du Bénin : mot, vision, priorités du mandat et attributions statutaires.",
  alternates: { canonical: "/presidence" },
};

const president = benPosts[0];

export default function PresidencePage() {
  return (
    <>
      <PageHero
        eyebrow="Présidence"
        crumbs={[{ label: "Le Sénat", href: "/le-senat" }, { label: "Présidence" }]}
        title="La présidence du Sénat des Jeunes du Bénin"
        lede="Premier responsable de l'association, le Président représente le SJB, convoque et dirige les réunions et négocie les partenariats."
      />

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[22rem_1fr] lg:gap-24">
          <Reveal dir="left">
            <Portrait alt="Portrait officiel du Président du Sénat des Jeunes du Bénin" />
            <div className="mt-7">
              <p className="font-display text-[0.66rem] uppercase tracking-[0.28em] text-gold-600">Président du Bureau Exécutif National</p>
              <p className="h-display mt-3 text-2xl text-green-900">
                <Todo what="prénoms et nom du Président" />
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading eyebrow="Mot du Président" title="Un engagement au service de la jeunesse" />
            <Reveal delay={150} className="mt-10 border-l-2 border-gold-500 pl-7">
              <p className="font-serif text-2xl italic leading-relaxed text-ink-soft">
                <Todo what="mot du Président (150 à 300 mots)" />
              </p>
            </Reveal>
            <div className="mt-16 grid gap-10 sm:grid-cols-2">
              {[
                ["Vision pour la jeunesse", "vision du Président"],
                ["Priorités du mandat", "priorités du mandat"],
                ["Actions réalisées", "actions réalisées"],
                ["Engagements", "engagements"],
              ].map(([t, w], i) => (
                <Reveal key={t} delay={(i % 2) * 100}>
                  <h3 className="h-display border-b border-cream-300 pb-3 text-lg text-green-900">{t}</h3>
                  <p className="mt-4">
                    <Todo what={w} />
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-dark on-dark section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading dark eyebrow="Attributions statutaires" title="Ce que prévoient les statuts" lede="Article 16.1 des statuts du SJB." />
          <ul className="divide-y divide-gold-400/20">
            {president.duties.map((d, i) => (
              <Reveal as="li" key={d} delay={i * 80} className="flex gap-6 py-6 first:pt-0">
                <span className="font-display text-xl font-semibold text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-serif text-2xl leading-snug text-cream-50">{d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb text-center">
          <Reveal>
            <ButtonLink href="/bureau-executif" variant="outline-dark">
              Découvrir le Bureau Exécutif National
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
