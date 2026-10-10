import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { getPublicDocuments } from "@/lib/data";

export const metadata: Metadata = {
  title: "Documents officiels · Statuts, décrets, délibérations",
  description: "Statuts, décrets, délibérations et rapports officiels du Sénat des Jeunes du Bénin, en téléchargement.",
  alternates: { canonical: "/documents" },
};

export default async function DocumentsPage() {
  const documents = await getPublicDocuments();
  return (
    <>
      <PageHero
        eyebrow="Transparence"
        crumbs={[{ label: "Transparence", href: "/transparence" }, { label: "Documents officiels" }]}
        title="Les textes officiels du SJB"
        lede="Statuts, décrets, délibérations et rapports : toute la documentation institutionnelle, publiée et téléchargeable."
      />
      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Textes fondamentaux et décrets" title="Bibliothèque officielle" />
          <ul className="mt-14 divide-y divide-cream-300 border-y border-cream-300">
            {documents.map((d, i) => (
              <Reveal as="li" key={d.slug} delay={i * 90} className="grid gap-6 py-10 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.1em] text-gold-600">
                    {[d.kind, d.date].filter(Boolean).join(" · ")}
                  </p>
                  <h2 className="h-display mt-3 text-xl text-green-900 sm:text-2xl">{d.title}</h2>
                  {d.ref && <p className="mt-2 text-ink-mute">{d.ref}</p>}
                </div>
                <ButtonLink href={d.file} variant="outline-dark" small download>
                  Télécharger
                </ButtonLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-cream-300">
        <div className="container-sjb grid gap-8 md:grid-cols-3">
          {[
            ["Règlement intérieur", "règlement intérieur approuvé par l'Assemblée Plénière"],
            ["Registre des délibérations", "délibérations numérotées (ex. n°001/SJB/2026)"],
            ["Rapports d'activités", "rapports d'activités et financiers certifiés"],
          ].map(([t, w], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="card-lux h-full p-9">
                <h3 className="h-display text-lg text-green-900">{t}</h3>
                <p className="mt-4 text-ink-soft">Bientôt disponible en ligne.</p>
                <p className="mt-4">
                  <Todo what={w} />
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
