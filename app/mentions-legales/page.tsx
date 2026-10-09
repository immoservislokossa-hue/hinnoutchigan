import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Todo } from "@/components/ui/Todo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" crumbs={[{ label: "Mentions légales" }]} title="Mentions légales" />
      <section className="section-y">
        <div className="container-sjb">
          <div className="prose-sjb mx-auto max-w-3xl">
            <h2 className="h-display mb-4 text-2xl text-green-900">Éditeur du site</h2>
            <p>
              Sénat des Jeunes du Bénin (SJB), association de droit béninois à but non lucratif, régie par la {site.legalRef}. Siège :{" "}
              {site.seat}. Adresse : {site.contact.address ?? <Todo what="adresse physique" />}
            </p>
            <p>
              Identifiant au Registre électronique des Associations et Fondations : <Todo what="numéro d'enregistrement" />
            </p>
            <p>
              Directeur de la publication : <Todo what="nom du directeur de la publication" />
            </p>
            <p>
              Contact : {site.contact.email ?? <Todo what="courriel officiel" />}
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Hébergement</h2>
            <p>
              <Todo what="nom et adresse de l'hébergeur" />
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Conception et réalisation</h2>
            <p>{site.credit ?? <Todo what="agence ou prestataire" />}</p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Propriété intellectuelle</h2>
            <p>
              Le logo, la devise et les contenus du site sont la propriété du Sénat des Jeunes du Bénin. Le logo officiel est déposé et
              protégé : toute modification est soumise à la validation de l&apos;Assemblée Plénière. Toute reproduction sans autorisation
              écrite est interdite.
            </p>

            <h2 className="h-display mb-4 mt-12 text-2xl text-green-900">Neutralité</h2>
            <p>
              Le SJB est une association sans prise de position partisane. Il ne doit pas être confondu avec le Sénat de la République.
              Les contenus de ce site n&apos;engagent aucun parti ni aucun candidat politique.
            </p>
            <p className="mt-10 text-sm">
              <Todo what="relecture juridique de ces mentions" />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
