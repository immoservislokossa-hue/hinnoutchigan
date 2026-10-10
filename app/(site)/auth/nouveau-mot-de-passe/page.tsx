import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { NewPasswordForm } from "@/components/auth/AuthForms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewPasswordPage() {
  const { user } = await getSession();
  if (!user) redirect("/connexion");
  return (
    <>
      <PageHero eyebrow="Espace membres" crumbs={[{ label: "Nouveau mot de passe" }]} title="Choisissez votre mot de passe" lede="Il vous servira à vous connecter à votre espace." />
      <section className="section-y">
        <div className="container-sjb">
          <div className="mx-auto max-w-md">
            <NewPasswordForm />
          </div>
        </div>
      </section>
    </>
  );
}
