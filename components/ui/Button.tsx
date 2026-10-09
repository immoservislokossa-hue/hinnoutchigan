import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "gold" | "outline" | "outline-dark";

const variantClass: Record<ButtonVariant, string> = {
  primary: "",
  gold: "btn-gold",
  outline: "btn-outline",
  "outline-dark": "btn-outline-dark",
};

function cls(variant: ButtonVariant, small: boolean, extra?: string) {
  return ["btn", variantClass[variant], small ? "btn-sm" : "", extra ?? ""].filter(Boolean).join(" ");
}

type CommonProps = {
  variant?: ButtonVariant;
  small?: boolean;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

/** Bouton « Sceau » : seule direction artistique de bouton du site. */
export function ButtonLink({
  href,
  variant = "primary",
  small = false,
  arrow = true,
  className,
  children,
  download,
}: CommonProps & { href: string; download?: boolean }) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <span className="btn-arrow" aria-hidden="true" />}
    </>
  );
  const external = /^(https?:|mailto:|tel:)/.test(href) || download || href.endsWith(".pdf");
  if (external) {
    const isWeb = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls(variant, small, className)}
        {...(download ? { download: true } : {})}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls(variant, small, className)}>
      {content}
    </Link>
  );
}

export function Button({
  variant = "primary",
  small = false,
  arrow = true,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cls(variant, small, className)} {...rest}>
      <span>{children}</span>
      {arrow && <span className="btn-arrow" aria-hidden="true" />}
    </button>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      <span>{children}</span>
      <span className="btn-arrow" aria-hidden="true" />
    </Link>
  );
}
