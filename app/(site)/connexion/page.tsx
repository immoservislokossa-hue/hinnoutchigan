import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { LoginForm } from "@/components/auth/AuthForms";
import { getSession } from "@/lib/auth";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Connexion · Espace membres",
  description: "Accès à l'espace des membres et au back-office du Sénat des Jeunes du Bénin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  suspendu: "Ce compte est suspendu. Contactez le secrétariat.",
  lien: "Ce lien est invalide ou a expiré. Demandez-en un nouveau.",
};

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const target = safeNext(next);
  const { user, profile } = await getSession();
  if (user && profile?.status === "active") redirect(target);

  return (
    <>
      <PageHero eyebrow="Espace membres" crumbs={[{ label: "Connexion" }]} title="Connexion" lede="Accédez à votre espace personnel ou au back-office." />
      <section className="section-y">
        <div className="container-sjb">
          <div className="mx-auto max-w-md">
            {isSupabaseConfigured ? (
              <LoginForm next={target} notice={error ? notices[error] : undefined} />
            ) : (
              <div className="card-lux p-6 sm:p-9">
                <h2 className="h-display text-2xl text-green-900">Espace bientôt disponible</h2>
                <p className="mt-3 text-ink-soft">La connexion sera activée dès que le service sera relié. Contactez le secrétariat pour plus d&apos;informations.</p>
              </div>
            )}
            <p className="mt-6 text-center text-sm text-ink-mute">
              Les comptes sont créés sur invitation par le secrétariat. L&apos;inscription n&apos;est pas ouverte au public.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
