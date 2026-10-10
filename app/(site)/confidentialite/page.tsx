import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Todo } from "@/components/ui/Todo";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment le Sénat des Jeunes du Bénin collecte, utilise et protège vos données personnelles.",
  alternates: { canonical: "/confidentialite" },
};

export default async function ConfidentialitePage() {
  const cfg = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Données personnelles" crumbs={[{ label: "Confidentialité" }]} title="Politique de confidentialité" />
      <section className="section-y">
        <div className="container-sjb">
          <div className="prose-sjb mx-auto max-w-3xl">
            <h2 className="h-display mb-4 text-2xl text-green-900">Responsable du traitement</h2>
            <p>
              Le Sénat des Jeunes du Bénin, dont le siège est à {site.seat}, est responsable des données collectées sur ce site. Contact :{" "}
              {cfg.contact.email ?? <Todo what="courriel de contact données personnelles" />}
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Données collectées et finalités</h2>
            <p>
              Les formulaires du site (contact, demande d&apos;adhésion, engagement, partenariat, presse, lettre d&apos;information)
              collectent uniquement les informations que vous saisissez : identité, coordonnées, territoire, âge et contenu de votre
              message. Elles sont utilisées pour traiter votre demande, vous répondre et, pour une adhésion, instruire votre dossier selon
              la procédure des statuts.
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Base du traitement</h2>
            <p>Votre consentement, recueilli sur chaque formulaire, et l&apos;exécution de votre demande.</p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Destinataires et durée de conservation</h2>
            <p>
              Les données sont accessibles aux seuls responsables habilités du SJB. Elles ne sont ni vendues ni cédées. Durée de
              conservation : {cfg.legal.retention ?? <Todo what="durée de conservation par type de demande" />}
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Vos droits</h2>
            <p>
              Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données et retirer votre consentement à tout
              moment, en écrivant à l&apos;adresse de contact ci-dessus. Vous pouvez aussi saisir l&apos;autorité béninoise de protection
              des données personnelles.
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Cookies et mesure d&apos;audience</h2>
            <p>
              Ce site n&apos;utilise aucun cookie publicitaire ni outil de suivi tiers. Si un outil de mesure d&apos;audience est ajouté
              ultérieurement, cette page sera mise à jour.
            </p>
            <p className="mt-10 text-sm">
              <Todo what="relecture juridique de cette politique" />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
