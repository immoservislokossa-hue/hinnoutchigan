import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { AdhesionForm } from "@/components/forms/forms";
import { engagementIndex, feeTable, memberCategories } from "@/content/structure";

export const metadata: Metadata = {
  title: "Rejoindre le SJB · Devenir membre",
  description: "Catégories de membres, procédure d'adhésion, Indice d'Engagement et droits d'adhésion du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/rejoindre" },
};

const steps = [
  ["Demande", "Vous adressez votre demande d'adhésion au Président du SJB."],
  ["Examen", "Le Bureau Exécutif National instruit votre dossier."],
  ["Validation", "La demande est validée en Assemblée Plénière."],
  ["Adhésion", "Après paiement des droits, vous recevez votre reçu et votre carte de membre."],
];

const faq = [
  ["Suis-je membre si j'ai rejoint un groupe WhatsApp ou une page du SJB ?", "Non. L'appartenance à une communauté virtuelle ou à un groupe en ligne associé au SJB ne confère en aucun cas la qualité de membre. Seule la procédure formelle d'adhésion définie par les statuts et le règlement intérieur ouvre des droits associatifs."],
  ["Quel âge faut-il avoir ?", "Le SJB accueille toutes les générations : le CCJ (moins de 25 ans, dès le plus jeune âge), le CLAP (26 à 34 ans) et le CSM (35 ans et plus). Le groupe dépend de votre âge."],
  ["Que se passe-t-il si je ne peux plus cotiser ou participer ?", "Le membre qui ne satisfait plus aux critères de l'Indice d'Engagement est reclassé membre bénévole occasionnel, avec notification personnelle. Il perd le droit de vote mais conserve un lien avec l'association et peut être accompagné pour retrouver son statut."],
  ["Puis-je être membre sans être béninois ?", "Les membres fondateurs sont des jeunes béninois. Les personnes physiques ou morales qui soutiennent les objectifs du SJB peuvent devenir membres sympathisants. Pour les autres cas, contactez-nous."],
];

export default function RejoindrePage() {
  return (
    <>
      <PageHero
        eyebrow="Rejoindre"
        crumbs={[{ label: "Rejoindre" }]}
        title="Devenez membre du Sénat des Jeunes du Bénin"
        lede="Entrez dans une école d'engagement : voix délibérative, formation, accompagnement professionnel et carte de membre."
      />

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="La procédure" title="Quatre étapes, un cadre statutaire" />
          <ol className="mt-16 grid gap-px bg-cream-300 md:grid-cols-4">
            {steps.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 100} className="bg-cream-50 p-9">
                <p className="font-display text-5xl font-semibold text-gold-500/80">{i + 1}</p>
                <h3 className="h-display mt-5 text-lg text-green-900">{t}</h3>
                <p className="mt-3 text-[0.97rem] text-ink-soft">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-cream-100">
        <div className="container-sjb">
          <SectionHeading eyebrow="Catégories" title="Cinq façons d'appartenir au SJB" />
          <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memberCategories.map((m, i) => (
              <Reveal as="li" key={m.title} delay={(i % 3) * 100}>
                <article className="card-lux h-full p-9">
                  <h3 className="h-display text-lg text-green-900">{m.title}</h3>
                  <p className="mt-4 text-[0.97rem] text-ink-soft">{m.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark on-dark section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <SectionHeading
              dark
              eyebrow="Indice d'Engagement"
              title="Un engagement qui se vit et se mesure"
              lede="Évalué chaque trimestre par le Bureau Exécutif National, il conditionne la voix délibérative et l'éligibilité."
            />
            <ul className="mt-10 space-y-5">
              {engagementIndex.map((e, i) => (
                <Reveal as="li" key={e} delay={i * 90} className="flex gap-5">
                  <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 rotate-45 bg-gold-400" />
                  <span className="font-serif text-xl text-cream-50">{e}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal>
            <h3 className="font-display text-[0.72rem] uppercase tracking-[0.28em] text-gold-300">Droits d&apos;adhésion et cotisations (FCFA)</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">Barème statutaire des droits d&apos;adhésion et cotisations par tranche d&apos;âge</caption>
                <thead>
                  <tr className="border-b border-gold-400/50 font-display text-[0.62rem] uppercase tracking-[0.22em] text-gold-300">
                    <th scope="col" className="py-4 pr-4 font-semibold">Tranche d&apos;âge</th>
                    <th scope="col" className="py-4 pr-4 font-semibold">Groupe</th>
                    <th scope="col" className="py-4 pr-4 text-right font-semibold">Adhésion</th>
                    <th scope="col" className="py-4 pr-4 text-right font-semibold">Mensuelle</th>
                    <th scope="col" className="py-4 text-right font-semibold">Annuelle</th>
                  </tr>
                </thead>
                <tbody>
                  {feeTable.map((r) => (
                    <tr key={r.ages} className="border-b border-gold-400/15 text-cream-100/90">
                      <th scope="row" className="py-4 pr-4 font-serif text-lg font-medium">{r.ages}</th>
                      <td className="py-4 pr-4 text-sm text-cream-100/70">{r.group}</td>
                      <td className="py-4 pr-4 text-right tabular-nums">{r.join}</td>
                      <td className="py-4 pr-4 text-right tabular-nums">{r.monthly}</td>
                      <td className="py-4 text-right tabular-nums">{r.yearly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-sm text-cream-100/65">
              Barème de l&apos;article 26 des statuts. Les cotisations ne sont dues que par les membres adhérents engagés. <Todo what="confirmation du barème en vigueur" />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Demande d'adhésion" title="Déposez votre candidature" />
            <ul className="mt-12 space-y-0 divide-y divide-cream-300 border-y border-cream-300">
              {faq.map(([q, a]) => (
                <li key={q}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-xl font-medium leading-snug text-green-900">
                      {q}
                      <span aria-hidden="true" className="mt-2 block h-2.5 w-2.5 shrink-0 rotate-45 border-b border-r border-gold-600 transition-transform duration-500 group-open:-rotate-[135deg]" />
                    </summary>
                    <p className="mt-4 text-[0.97rem] text-ink-soft">{a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <AdhesionForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
