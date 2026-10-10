import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu">
        <PageHero eyebrow="Erreur 404" title="Cette page est introuvable" lede="Le lien est peut-être incorrect ou la page a été déplacée.">
          <ButtonLink href="/" variant="gold">
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-dark">
            Nous contacter
          </ButtonLink>
        </PageHero>
      </main>
      <Footer />
    </>
  );
}
