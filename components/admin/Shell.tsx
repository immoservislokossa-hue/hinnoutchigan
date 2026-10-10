import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NavLinks, type NavItem } from "./NavLinks";
import { ROLE_LABELS } from "@/lib/roles";
import { signOutAction } from "@/lib/auth-actions";
import type { Profile } from "@/lib/auth";

export function Shell({
  area,
  profile,
  nav,
  switchTo,
  children,
}: {
  area: "admin" | "espace";
  profile: Profile;
  nav: NavItem[];
  switchTo?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-cream-300 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={area === "admin" ? "/admin" : "/espace"} className="flex min-w-0 items-center gap-3">
            <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
              <Logo size={80} className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-semibold tracking-tight text-green-900">
                {area === "admin" ? "Back-office SJB" : "Espace membre"}
              </span>
              <span className="block truncate text-xs text-ink-mute">{ROLE_LABELS[profile.role]}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {switchTo && (
              <Link href={switchTo.href} className="hidden rounded-full border border-cream-300 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50 sm:block">
                {switchTo.label}
              </Link>
            )}
            <Link href="/" className="hidden rounded-full px-3 py-2 text-sm text-ink-mute hover:text-green-800 md:block">
              Voir le site
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="rounded-full bg-cream-100 px-4 py-2 text-sm font-medium text-ink hover:bg-green-50">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:py-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <NavLinks items={nav} />
          {switchTo && (
            <Link href={switchTo.href} className="mt-3 block rounded-full border border-cream-300 px-4 py-2.5 text-center text-sm font-medium text-green-800 sm:hidden">
              {switchTo.label}
            </Link>
          )}
        </aside>
        <main id="contenu" className="mt-6 min-w-0 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
