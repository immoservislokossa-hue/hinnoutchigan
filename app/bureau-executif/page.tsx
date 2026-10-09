import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Portrait } from "@/components/ui/Portrait";
import { Todo } from "@/components/ui/Todo";
import { benPosts } from "@/content/structure";

export const metadata: Metadata = {
  title: "Bureau Exécutif National",
  description:
    "Les sept membres du Bureau Exécutif National du Sénat des Jeunes du Bénin : composition, attributions et règles de gouvernance intergénérationnelle.",
  alternates: { canonical: "/bureau-executif" },
};

export default function BenPage() {
  return (
    <>
      <PageHero
        eyebrow="Bureau Exécutif National"
        crumbs={[{ label: "Le Sénat", href: "/le-senat" }, { label: "Bureau exécutif" }]}
        title="Sept responsables, trois générations"
        lede="Organe exécutif de l'association, le BEN est élu pour deux ans, renouvelables une fois. Sa composition reflète une gouvernance intergénérationnelle et inclusive."
      />

      <section className="section-y">
        <div className="container-sjb">
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {benPosts.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 110} className={i === 0 ? "lg:col-span-3" : ""}>
                <article className={i === 0 ? "grid gap-10 md:grid-cols-[18rem_1fr] md:items-center" : ""}>
                  <Portrait alt={`Portrait du ou de la ${p.title}`} className={i === 0 ? "max-w-xs" : ""} />
                  <div className={i === 0 ? "" : "mt-7"}>
                    <p className="font-display text-[0.66rem] uppercase tracking-[0.28em] text-gold-600">{p.origin}</p>
                    <h2 className="h-display mt-3 text-2xl text-green-900">{p.title}</h2>
                    <p className="mt-2 font-serif text-xl italic text-ink-mute">
                      <Todo what="prénoms et nom" />
                    </p>
                    <ul className="mt-5 space-y-2 text-[0.97rem] text-ink-soft">
                      {p.duties.map((d) => (
                        <li key={d} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark on-dark section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading dark eyebrow="Règles de composition" title="Inclusion, parité et renouvellement" />
          <ul className="grid gap-px bg-gold-400/25 sm:grid-cols-2">
            {[
              ["7", "membres au sein du BEN"],
              ["40 %", "de femmes au minimum"],
              ["2 ans", "de mandat, renouvelable une fois"],
              ["< 30 ans", "pour le Président à l'élection"],
            ].map(([v, l], i) => (
              <Reveal as="li" key={l} delay={i * 80} className="bg-green-950 p-8">
                <p className="font-display text-4xl font-semibold text-gold-300">{v}</p>
                <p className="mt-3 text-cream-100/75">{l}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <SectionHeading eyebrow="Élections" title="Une procédure ouverte et transparente" />
          <Reveal className="prose-sjb">
            <p>
              Le BEN sortant lance un appel à candidature au plus tard trente jours avant la fin de son mandat ; les candidatures sont
              ouvertes pendant dix jours. Le candidat à la Présidence soumet un <strong>projet d&apos;action détaillé</strong> et la
              composition complète du bureau qu&apos;il envisage.
            </p>
            <p>
              L&apos;élection a lieu lors de l&apos;Assemblée Générale élective, au <strong>vote secret</strong>, avec procuration
              possible (deux au plus par personne). Le nouveau BEN prend ses responsabilités le 1<sup>er</sup> janvier suivant son
              élection.
            </p>
            <p>
              Est éligible tout membre adhérent engagé, à jour de ses cotisations, satisfaisant à l&apos;Indice d&apos;Engagement,
              respectant les critères d&apos;âge du poste visé, sans exclusion antérieure et ayant participé activement aux travaux de
              l&apos;association au cours des douze derniers mois.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
