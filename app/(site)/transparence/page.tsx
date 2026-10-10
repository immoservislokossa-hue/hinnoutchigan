import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";

export const metadata: Metadata = {
  title: "Transparence & reddition de comptes",
  description: "Ressources, garde des fonds, Commissariat aux Comptes et rapports annuels : les engagements de transparence du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/transparence" },
};

const commitments = [
  {
    t: "Des ressources clairement identifiées",
    d: "Droits d'adhésion, cotisations, souscriptions spéciales, subventions, dons et legs, produits d'activités accessoires non redistribuables aux membres et concours de partenaires partageant les objectifs du SJB.",
  },
  {
    t: "Des fonds sécurisés",
    d: "Les fonds sont déposés dans un compte bancaire à deux signataires obligatoires : le Président et le Trésorier Général. Tout retrait ou transfert porte les deux signatures ; la caisse de petites dépenses est plafonnée à 50 000 FCFA.",
  },
  {
    t: "Un contrôle externe",
    d: "Le Commissariat aux Comptes, composé de trois membres élus par l'Assemblée Plénière et indépendants du BEN, audite la gestion financière et matérielle et rend compte à l'Assemblée.",
  },
  {
    t: "Une publication annuelle",
    d: "Chaque année, avant le 30 avril, un rapport général détaillant programmes, ressources financières et perspectives est publié dans le journal du Registre des Associations et Fondations.",
  },
  {
    t: "Des comptes devant les membres",
    d: "Le BEN soumet à l'Assemblée Plénière, à chaque session ordinaire, un rapport d'activités et un rapport financier certifiés par le Commissariat aux Comptes.",
  },
  {
    t: "Des partenariats formalisés",
    d: "Tout partenariat est formalisé par une convention signée par les deux parties et soumise à l'information de l'Assemblée Plénière, sans compromettre l'indépendance ni la neutralité partisane.",
  },
];

export default function TransparencePage() {
  return (
    <>
      <PageHero
        eyebrow="Transparence"
        crumbs={[{ label: "Transparence" }]}
        title="Rendre compte, c'est notre manière de mériter la confiance"
        lede="Conformément à la loi n° 2025-19, le SJB s'engage sur la gouvernance démocratique, la transparence financière et la reddition de comptes."
      />
      <section className="section-y">
        <div className="container-sjb">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <Reveal as="li" key={c.t} delay={(i % 3) * 100}>
                <article className="card-lux h-full p-9">
                  <p className="font-display text-4xl font-semibold text-gold-500/80">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="h-display mt-4 text-lg text-green-900">{c.t}</h2>
                  <p className="mt-4 text-[0.97rem] text-ink-soft">{c.d}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Rapports publiés" title="Dernières publications" />
          <Reveal className="mt-12 border border-dashed border-cream-300 p-10 text-center">
            <p className="font-serif text-2xl text-ink-soft">
              <Todo what="rapport général annuel et rapports financiers certifiés" />
            </p>
          </Reveal>
          <Reveal className="mt-12 text-center">
            <ButtonLink href="/documents" variant="gold">
              Documents officiels
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
