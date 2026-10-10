import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/Ornament";
import { ButtonLink } from "@/components/ui/Button";
import { objectives, pillars, timeline } from "@/content/structure";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Le Sénat · Mission, vision et valeurs",
  description:
    "Mission, vision, valeurs et histoire du Sénat des Jeunes du Bénin : une association de jeunesse fondée sur la démocratie participative, le développement humain intégral et le panafricanisme civique.",
  alternates: { canonical: "/le-senat" },
};

export default function SenatPage() {
  return (
    <>
      <PageHero
        eyebrow="Le Sénat"
        crumbs={[{ label: "Le Sénat" }]}
        title="Une école d'engagement, de formation et d'action"
        lede="Association idéologique à but non lucratif, le SJB forme des jeunes capables d'analyser, de débattre et d'agir pour le développement de leur communauté et de leur nation."
      />

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <SectionHeading eyebrow="Ce que nous sommes" title="Un cadre pour que la jeunesse prenne la parole" />
          <Reveal className="prose-sjb">
            <p>
              Le Sénat des Jeunes du Bénin est une <strong>association de développement à but non lucratif</strong>, fondée sur trois
              piliers : la démocratie participative, le développement humain intégral et le panafricanisme civique. Il croit en la
              capacité des jeunes à transformer positivement leur société à travers l&apos;engagement, la formation et l&apos;action
              collective.
            </p>
            <p>
              Il contribue à la paix, au vivre-ensemble et à la bonne gouvernance. Il peut se prononcer sur tout sujet d&apos;intérêt
              général touchant à la condition humaine, sociale, économique, culturelle ou environnementale, <strong>sans prendre
              position en faveur d&apos;un parti ou d&apos;un candidat politique</strong>.
            </p>
            <p>
              Association de débats, d&apos;actions, de propositions et d&apos;échanges d&apos;informations, le SJB est aussi un
              espace de formation pratique à l&apos;engagement, où chaque membre est accompagné dans le développement de ses
              compétences citoyennes, associatives et professionnelles. Il est <strong>membre fondateur du Sénat des Jeunes
              d&apos;Afrique (SJA)</strong>. Son siège est établi à {site.seat.split(",")[0]} et des sections sont créées dans
              tous les arrondissements et communes du Bénin.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <Reveal className="mx-auto max-w-4xl text-center">
            <span className="eyebrow ">Notre vision</span>
            <blockquote className="mt-9 font-serif text-3xl font-medium italic leading-snug text-green-900 sm:text-4xl lg:text-5xl">
              « Un Bénin où chaque jeune, quelle que soit son origine ou sa condition sociale, dispose des ressources, des compétences
              et des espaces pour contribuer pleinement au développement national. »
            </blockquote>
            <div className="mx-auto mt-12 max-w-xs">
              <Ornament />
            </div>
            <p className="mt-8 text-ink-soft">
              Le SJB aspire à devenir le cadre de référence de la jeunesse béninoise engagée, inclusive et panafricaine.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Nos valeurs" title="Trois piliers fondateurs" align="center" />
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120}>
                <article className="card-lux h-full p-9">
                  <p className="font-display text-5xl font-semibold text-gold-500/80">0{i + 1}</p>
                  <h3 className="h-display mt-5 text-xl text-green-900">{p.title}</h3>
                  <p className="mt-4 text-ink-soft">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-cream-300">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Objectifs statutaires" title="Huit engagements pour la jeunesse" />
          </div>
          <ol className="divide-y divide-cream-300">
            {objectives.map((o, i) => (
              <Reveal as="li" key={o} delay={(i % 4) * 60} className="flex gap-6 py-6 first:pt-0">
                <span className="font-display text-2xl font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-serif text-2xl leading-snug text-green-900">{o}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal className="prose-sjb">
            <span className="eyebrow">Devise et emblème</span>
            <h2 className="h-display mb-7 mt-5 text-3xl text-green-900 sm:text-4xl">« {site.motto} »</h2>
            <p>
              Le logo du SJB est composé de la <strong>carte du Bénin</strong>, de feuillets verts et d&apos;une banderole jaune
              portant la mention SÉNAT DES JEUNES DU BÉNIN, encadrés par un carré aux couleurs nationales.
            </p>
            <p>
              Le logo officiel est déposé et protégé. Toute modification est soumise à la validation de l&apos;Assemblée Plénière.
            </p>
          </Reveal>
          <Reveal dir="right" className="flex justify-center">
            <div className="relative w-full max-w-xs p-5">
              <span aria-hidden="true" className="absolute inset-0 border border-gold-400" />
              <span aria-hidden="true" className="absolute inset-[9px] border border-cream-300" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo officiel du Sénat des Jeunes du Bénin" width={680} height={708} className="relative h-auto w-full max-w-[18rem] bg-white p-2 sm:max-w-xs" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading eyebrow="Repères" title="Une histoire en textes" lede="Les dates clés, telles qu'elles figurent dans les textes officiels du SJB." />
          <ol className="relative mt-16 border-l border-cream-300 pl-8 sm:ml-4 sm:pl-12">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.date} delay={(i % 3) * 70} className="relative pb-12 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[2.58rem] top-2 h-3 w-3 rotate-45 border border-gold-500 bg-cream-50 sm:-left-[3.58rem]" />
                <p className="font-display text-xs uppercase tracking-[0.1em] text-gold-600">{t.date}</p>
                <h3 className="h-display mt-2 text-xl text-green-900">{t.title}</h3>
                <p className="mt-2 max-w-xl text-ink-soft">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb">
          <Reveal className="mx-auto max-w-3xl border border-cream-300 bg-cream-100 p-8 text-center sm:p-12">
            <p className="font-display text-xs uppercase tracking-[0.1em] text-gold-600">Précision</p>
            <p className="mt-5 font-serif text-2xl leading-snug text-green-900">
              Le Sénat des Jeunes du Bénin est une association de droit béninois. Il ne doit pas être confondu avec le Sénat de la
              République.
            </p>
            <div className="mt-8">
              <ButtonLink href="/documents" variant="outline-dark">
                Consulter les statuts
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
