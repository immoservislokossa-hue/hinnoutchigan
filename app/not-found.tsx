import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageHero eyebrow="Erreur 404" title="Cette page est introuvable" lede="Le lien est peut-être incorrect ou la page a été déplacée.">
      <div className="flex flex-wrap gap-4">
        <ButtonLink href="/" variant="gold">
          Retour à l&apos;accueil
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline-dark">
          Nous contacter
        </ButtonLink>
      </div>
    </PageHero>
  );
}
