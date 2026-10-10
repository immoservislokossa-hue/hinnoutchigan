import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ResetRequestForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false, follow: false } };

export default function ResetPage() {
  return (
    <>
      <PageHero eyebrow="Espace membres" crumbs={[{ label: "Connexion", href: "/connexion" }, { label: "Mot de passe oublié" }]} title="Mot de passe oublié" lede="Saisissez l'adresse de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe." />
      <section className="section-y">
        <div className="container-sjb">
          <div className="mx-auto max-w-md">
            <ResetRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
