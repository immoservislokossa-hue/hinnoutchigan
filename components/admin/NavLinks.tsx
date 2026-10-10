"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; badge?: number };

/** Navigation du back-office / de l'espace : pastilles défilantes sur mobile, menu vertical sur grand écran. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" || href === "/espace" ? pathname === href : pathname === href || pathname.startsWith(href + "/"));
  return (
    <nav aria-label="Navigation de l'espace" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={active(i.href) ? "page" : undefined}
          className={`flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors lg:rounded-xl lg:py-2.5 ${
            active(i.href) ? "bg-green-800 text-white" : "bg-cream-100 text-ink hover:bg-green-50 lg:bg-transparent"
          }`}
        >
          {i.label}
          {i.badge ? <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-semibold text-green-950">{i.badge}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
