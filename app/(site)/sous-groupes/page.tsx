import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { subGroups } from "@/content/structure";

export const metadata: Metadata = {
  title: "Sous-groupes · CCJ, CLAP et CSM",
  description:
    "Le Conseil Consultatif des Jeunes, le Comité de Leadership Associatif et Politique et le Conseil des Séniors et Mentors : trois générations au cœur du SJB.",
  alternates: { canonical: "/sous-groupes" },
};

export default function SousGroupesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sous-groupes"
        crumbs={[{ label: "Le Sénat", href: "/le-senat" }, { label: "Sous-groupes" }]}
        title="Apprendre, structurer, transmettre"
        lede="Les membres adhérents engagés sont répartis en trois sous-groupes selon leur tranche d'âge, chacun doté d'un rôle spécifique dans la gouvernance."
      />
      <section className="section-y">
        <div className="container-sjb space-y-24">
          {subGroups.map((g, i) => (
            <Reveal key={g.code}>
              <article className={`grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative">
                  <p className="font-display text-[7rem] font-semibold leading-none text-gold-400/70 sm:text-[9rem]">{g.code}</p>
                  <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-ink-mute">{g.ages}</p>
                  <span className="draw-line mt-8 block h-px w-32 bg-gold-500" />
                </div>
                <div>
                  <h2 className="h-display text-2xl text-green-900 sm:text-3xl">{g.name}</h2>
                  <p className="mt-6 text-ink-soft">{g.text}</p>
                  <ul className="mt-8 flex flex-wrap gap-3">
                    {g.levels.map((l) => (
                      <li key={l} className="border border-cream-300 px-4 py-2 font-display text-xs uppercase tracking-[0.1em] text-green-800">
                        {l}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 font-serif text-xl italic text-ink-mute">{g.lead}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <SectionHeading align="center" eyebrow="Mandat" title="Deux ans, renouvelables une fois" lede="Les instances des sous-groupes ont un mandat de deux ans. Au sein du BEN, le CCJ compte trois représentants et le CLAP trois, aux côtés du Président." />
          <Reveal className="mt-12 text-center">
            <ButtonLink href="/rejoindre" variant="gold">
              Rejoindre un sous-groupe
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
