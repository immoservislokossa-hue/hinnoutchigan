"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href?: string) => !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#contenu"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-green-950 focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-cream-300 bg-white py-2 pl-2.5 pr-2.5 transition-shadow duration-300 sm:pl-3 ${
            scrolled ? "shadow-[0_14px_34px_-18px_rgb(8_38_19/0.35)]" : "shadow-[0_2px_10px_-6px_rgb(8_38_19/0.2)]"
          }`}
        >
          <Link href="/" aria-label="Sénat des Jeunes du Bénin, accueil" className="flex shrink-0 items-center gap-3 rounded-full pr-3">
            <span className="block h-11 w-11 overflow-hidden rounded-full ring-1 ring-black/10">
              <Logo size={96} priority className="h-full w-full object-cover" />
            </span>
            <span className="hidden whitespace-nowrap font-display text-[1.02rem] font-semibold leading-tight tracking-tight text-green-900 sm:block">
              Sénat des Jeunes
              <span className="block text-xs font-medium tracking-normal text-ink-mute">du Bénin</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 xl:flex">
            {navigation.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href ?? "#"}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                    isActive(item.href) ? "bg-green-50 text-green-800" : "text-ink hover:bg-green-50"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 opacity-60 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-3xl border border-cream-300 bg-white p-2 shadow-[0_24px_48px_-24px_rgb(8_38_19/0.35)]">
                      {item.children.map((c) => (
                        <Link key={c.href + c.label} href={c.href} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-green-50">
                          <span className="block text-[0.92rem] font-semibold text-green-900">{c.label}</span>
                          {c.description && <span className="mt-0.5 block text-sm text-ink-mute">{c.description}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="/rejoindre" small className="hidden sm:inline-flex">
              Rejoindre
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full bg-green-50 text-green-900 xl:hidden"
            >
              <span className={`block h-0.5 w-5 rounded bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        <div
          id="menu-mobile"
          aria-hidden={!open}
          className={`mx-auto mt-2 max-h-[calc(100svh-6.5rem)] max-w-6xl overflow-y-auto rounded-3xl border border-cream-300 bg-white p-3 shadow-[0_24px_48px_-24px_rgb(8_38_19/0.35)] transition-all duration-300 xl:hidden ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <ul>
            {navigation.map((item) => (
              <li key={item.label} className="border-b border-cream-300 px-3 py-4 last:border-0">
                <Link href={item.href ?? "#"} tabIndex={open ? 0 : -1} className="font-display text-xl font-semibold tracking-tight text-green-900">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {item.children.map((c) => (
                      <li key={c.href + c.label}>
                        <Link href={c.href} tabIndex={open ? 0 : -1} className="text-sm text-ink-soft hover:text-green-700">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="p-3 pt-4">
            <ButtonLink href="/rejoindre" className="w-full">
              Rejoindre le SJB
            </ButtonLink>
          </div>
        </div>
      </header>
    </>
  );
}
