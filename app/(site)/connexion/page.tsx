import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Espace membres · Bientôt disponible",
  description: "L'espace membres du Sénat des Jeunes du Bénin ouvrira prochainement.",
  robots: { index: false, follow: true },
};

export default function ConnexionPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace membres"
        crumbs={[{ label: "Espace membres" }]}
        title="L'espace des sénateurs ouvre bientôt"
        lede="Profil, carte de membre, documents internes et rapports d'activité : chaque sénateur disposera de son espace personnel."
      />
      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading align="center" eyebrow="En préparation" title="Revenez très bientôt" lede="En attendant, découvrez l'organisation du SJB ou contactez le secrétariat." />
          <Reveal className="mt-12 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/organisation">Voir l&apos;organisation</ButtonLink>
            <ButtonLink href="/contact" variant="outline-dark">
              Contacter le secrétariat
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
