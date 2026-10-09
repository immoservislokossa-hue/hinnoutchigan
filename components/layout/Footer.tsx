import Link from "next/link";
import { footerColumns, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Todo } from "@/components/ui/Todo";
import { Sunburst } from "@/components/ui/Sunburst";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer() {
  const socials = Object.entries(site.social).filter(([, v]) => v) as [string, string][];
  return (
    <footer className="surface-dark on-dark relative overflow-hidden">
      <Sunburst className="absolute -bottom-72 -left-72 h-[50rem] w-[50rem] opacity-40" spin={false} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      <div className="container-sjb relative pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-5" aria-label="Sénat des Jeunes du Bénin, accueil">
              <span className="block h-20 w-20 overflow-hidden border border-gold-400">
                <Logo size={160} className="h-full w-full object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold tracking-[0.16em] text-cream-50">SÉNAT DES JEUNES</span>
                <span className="mt-2 font-display text-[0.7rem] tracking-[0.42em] text-gold-300">DU BÉNIN</span>
              </span>
            </Link>
            <p className="mt-8 font-serif text-2xl italic leading-snug text-gold-200">« {site.motto} »</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-100/70">
              Association de droit béninois, école d&apos;engagement, de formation et d&apos;action au service de la jeunesse béninoise.
            </p>
            <div className="mt-8 max-w-sm">
              <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold-300">Lettre d&apos;information</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-gold-300">{col.title}</h2>
                <ul className="mt-6 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="font-serif text-lg text-cream-100/80 transition-colors hover:text-gold-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-gold-400/25 pt-10 text-sm text-cream-100/75 md:grid-cols-3">
          <div>
            <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold-300">Siège</p>
            <p className="mt-3">{site.seat}</p>
            <p className="mt-1">{site.contact.address ?? <Todo what="adresse physique" />}</p>
          </div>
          <div>
            <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold-300">Contact</p>
            <p className="mt-3">
              {site.contact.email ? (
                <a href={`mailto:${site.contact.email}`} className="hover:text-gold-300">
                  {site.contact.email}
                </a>
              ) : (
                <Todo what="courriel officiel" />
              )}
            </p>
            <p className="mt-1">
              {site.contact.phones.length ? site.contact.phones.join(" · ") : <Todo what="téléphone" />}
            </p>
          </div>
          <div>
            <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold-300">Réseaux</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {socials.length ? (
                socials.map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-gold-300">
                    {k}
                  </a>
                ))
              ) : (
                <Todo what="liens des réseaux sociaux officiels" />
              )}
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-cream-100/55">
          Le Sénat des Jeunes du Bénin est une association de droit béninois, régie par la {site.legalRef}. Il ne doit pas être
          confondu avec le Sénat de la République. Association à but non lucratif, sans prise de position partisane.
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-gold-400/15 pt-6 text-xs text-cream-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sénat des Jeunes du Bénin. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className="hover:text-gold-300">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-gold-300">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-300">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="hover:text-gold-300">
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
