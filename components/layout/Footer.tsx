import Link from "next/link";
import { footerColumns, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Todo } from "@/components/ui/Todo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer() {
  const socials = Object.entries(site.social).filter(([, v]) => v) as [string, string][];
  return (
    <footer className="relative overflow-hidden border-t border-cream-300 bg-white text-ink">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22rem] font-bold leading-none text-transparent"
        style={{ WebkitTextStroke: "1.5px rgb(18 80 42 / 0.07)" }}
      >
        SJB
      </span>
      <div className="container-sjb relative pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Sénat des Jeunes du Bénin, accueil">
              <span className="block h-16 w-16 overflow-hidden rounded-2xl bg-white">
                <Logo size={128} className="h-full w-full object-cover" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-xl font-semibold tracking-tight">Sénat des Jeunes</span>
                <span className="text-sm text-ink-soft">du Bénin</span>
              </span>
            </Link>
            <p className="mt-8 font-display text-3xl font-semibold leading-tight tracking-tight text-green-700">
              Toujours là,
              <br />
              tel le soleil.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
              Association de droit béninois, école d&apos;engagement, de formation et d&apos;action au service de la jeunesse béninoise.
            </p>
            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-green-900">Lettre d&apos;information</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-green-700">{col.title}</h2>
                <ul className="mt-6 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.95rem] text-ink-soft transition-colors hover:text-green-900">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-cream-300 pt-10 text-sm text-ink-soft md:grid-cols-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-green-700">Siège</p>
            <p className="mt-3">{site.seat}</p>
            <p className="mt-1">{site.contact.address ?? <Todo what="adresse physique" />}</p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-green-700">Contact</p>
            <p className="mt-3">
              {site.contact.email ? (
                <a href={`mailto:${site.contact.email}`} className="hover:text-green-900">
                  {site.contact.email}
                </a>
              ) : (
                <Todo what="courriel officiel" />
              )}
            </p>
            <p className="mt-1">{site.contact.phones.length ? site.contact.phones.join(" · ") : <Todo what="téléphone" />}</p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-green-700">Réseaux</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {socials.length ? (
                socials.map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-green-900">
                    {k}
                  </a>
                ))
              ) : (
                <Todo what="liens des réseaux sociaux officiels" />
              )}
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ink-soft">
          Le Sénat des Jeunes du Bénin est une association de droit béninois, régie par la {site.legalRef}. Il ne doit pas être
          confondu avec le Sénat de la République. Association à but non lucratif, sans prise de position partisane.
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-cream-300 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sénat des Jeunes du Bénin. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className="hover:text-green-900">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-green-900">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-900">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="hover:text-green-900">
                Espace membres
              </Link>
            </li>
            <li>{site.credit ? `Site réalisé par ${site.credit}` : <Todo what="mention de l'agence" />}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
