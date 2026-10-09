import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { chain, organs, teamPosts } from "@/content/structure";

export const metadata: Metadata = {
  title: "Organisation · Organes et chaîne de commandement",
  description:
    "Assemblée Plénière, Bureau Exécutif National, sous-groupes, commissions, instances déconcentrées et Commissariat aux Comptes : l'organisation du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/organisation" },
};

export default function OrganisationPage() {
  return (
    <>
      <PageHero
        eyebrow="Organisation"
        crumbs={[{ label: "Le Sénat", href: "/le-senat" }, { label: "Organisation" }]}
        title="Des organes clairs, une gouvernance transparente"
        lede="Six organes délibérants et exécutifs, définis par les statuts conformément à la loi n° 2025-19, structurent l'action du SJB."
      />

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Les organes" title="Qui décide, qui exécute, qui contrôle" />
          <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organs.map((o, i) => (
              <Reveal as="li" key={o.name} delay={(i % 3) * 100}>
                <article className="card-lux h-full p-9">
                  <p className="font-display text-xs font-semibold tracking-[0.3em] text-gold-600">{o.code}</p>
                  <h3 className="h-display mt-4 text-xl text-green-900">{o.name}</h3>
                  <p className="mt-4 text-[0.97rem] text-ink-soft">{o.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark on-dark section-y">
        <div className="container-sjb">
          <SectionHeading dark eyebrow="Chaîne de commandement" title="Cinq échelons, un seul cap" lede="Chaque instance rend compte à celle de tutelle, jusqu'au Bureau Exécutif National." />
          <ol className="mt-16 grid gap-px bg-gold-400/25 md:grid-cols-5">
            {chain.map((c, i) => (
              <Reveal as="li" key={c.level} delay={i * 90} className="bg-green-950 p-8">
                <p className="font-display text-4xl font-semibold text-gold-300">{c.count}</p>
                <p className="mt-1 font-display text-[0.62rem] uppercase tracking-[0.25em] text-cream-100/60">{c.posts}</p>
                <h3 className="h-display mt-6 text-lg text-cream-50">{c.level}</h3>
                <p className="mt-3 text-sm text-cream-100/70">{c.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="Départements et communes"
              title="Neuf postes pour porter le SJB au plus près"
              lede="Chaque coordination départementale et chaque section communale réunit la même équipe de neuf responsables."
            />
            <Reveal delay={200} className="prose-sjb mt-8">
              <p>
                Les instances déconcentrées respectent l&apos;approche genre (au moins 40 % de femmes) et la limite d&apos;âge de 18 à 35 ans.
                Leur durée de fonctionnement est de douze mois environ, renouvelable une fois.
              </p>
            </Reveal>
            <Reveal delay={260} className="mt-8">
              <ButtonLink href="/territoires" variant="outline-dark">
                Voir les territoires
              </ButtonLink>
            </Reveal>
          </div>
          <ol className="grid gap-px border border-cream-300 bg-cream-300 sm:grid-cols-2">
            {teamPosts.map((p, i) => (
              <Reveal as="li" key={p} delay={(i % 2) * 80} className="flex items-start gap-4 bg-cream-50 p-6">
                <span className="font-display text-sm font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-xl leading-snug text-green-900">{p}</span>
              </Reveal>
            ))}
            <li className="flex items-center bg-cream-100 p-6 font-serif text-lg italic text-ink-mute">
              Arrondissements : Président, Secrétaire, Trésorier
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
