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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href?: string) => !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#contenu"
        className="fixed left-4 top-4 z-[100] -translate-y-24 bg-gold-400 px-4 py-2 font-display text-xs uppercase tracking-widest text-green-950 focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "bg-cream-50/92 shadow-[0_1px_0_0_var(--color-cream-300)] backdrop-blur-md" : "bg-transparent"
        }`}
        style={{ height: solid ? "4.25rem" : "var(--header-h)" }}
      >
        <div className="container-sjb flex h-full items-center justify-between gap-6">
          <Link href="/" aria-label="Sénat des Jeunes du Bénin, accueil" className="group flex items-center gap-4">
            <span
              className={`block overflow-hidden border border-gold-400 transition-all duration-500 ${
                solid ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
              <Logo size={96} priority className="h-full w-full object-cover" />
            </span>
            <span className="hidden shrink-0 flex-col whitespace-nowrap leading-none sm:flex">
              <span
                className={`font-display text-[0.95rem] font-semibold tracking-[0.18em] transition-colors duration-500 ${
                  solid ? "text-green-800" : "text-cream-50"
                }`}
              >
                SÉNAT DES JEUNES
              </span>
              <span
                className={`mt-1.5 font-display text-[0.62rem] tracking-[0.42em] transition-colors duration-500 ${
                  solid ? "text-gold-600" : "text-gold-300"
                }`}
              >
                DU BÉNIN
              </span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center xl:flex">
            {navigation.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href ?? "#"}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-3 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.17em] transition-colors duration-300 ${
                    solid ? "text-green-900 hover:text-gold-600" : "text-cream-50 hover:text-gold-300"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <span aria-hidden="true" className="mt-0.5 block h-1.5 w-1.5 rotate-45 border-b border-r border-current" />
                  )}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold-400 transition-transform duration-500 ${
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 translate-y-3 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="border border-gold-400/60 bg-cream-50 p-2 shadow-[0_30px_60px_-30px_rgb(8_38_15/0.5)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.href + c.label}
                          href={c.href}
                          className="group/item block px-5 py-3.5 transition-colors hover:bg-cream-100"
                        >
                          <span className="block font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-green-800 transition-colors group-hover/item:text-gold-600">
                            {c.label}
                          </span>
                          {c.description && <span className="mt-1 block text-sm text-ink-mute">{c.description}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="/rejoindre" small variant={solid ? "primary" : "gold"} className="hidden sm:inline-flex">
              Rejoindre
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={`relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-[7px] xl:hidden ${
                solid ? "text-green-900" : "text-cream-50"
              }`}
            >
              <span className={`block h-px w-7 bg-current transition-transform duration-500 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`block h-px w-7 bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        aria-hidden={!open}
        className={`surface-dark fixed inset-0 z-[55] overflow-y-auto transition-[clip-path] duration-700 [transition-timing-function:var(--ease-lux)] xl:hidden ${
          open ? "[clip-path:circle(150%_at_100%_0)]" : "pointer-events-none [clip-path:circle(0_at_100%_0)]"
        }`}
      >
        <div className="container-sjb pb-16 pt-28">
          <ul className="space-y-1">
            {navigation.map((item, i) => (
              <li
                key={item.label}
                className={`border-b border-gold-400/20 py-4 transition-all duration-700 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.href ?? "#"}
                  tabIndex={open ? 0 : -1}
                  className="font-display text-2xl font-semibold tracking-[0.08em] text-cream-50 hover:text-gold-300"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {item.children.map((c) => (
                      <li key={c.href + c.label}>
                        <Link
                          href={c.href}
                          tabIndex={open ? 0 : -1}
                          className="font-serif text-lg text-cream-100/75 hover:text-gold-300"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div
            className={`mt-10 transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: open ? "620ms" : "0ms" }}
          >
            <ButtonLink href="/rejoindre" variant="gold" className="w-full">
              Rejoindre le SJB
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
