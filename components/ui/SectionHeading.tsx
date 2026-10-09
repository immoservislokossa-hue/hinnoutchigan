import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  dark = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && (
        <Reveal>
          <span className={`eyebrow ${dark ? "on-dark" : ""}`}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={90}>
        <Tag
          className={`h-display mt-5 text-3xl sm:text-4xl lg:text-[2.85rem] ${dark ? "text-cream-50" : "text-green-900"}`}
        >
          {title}
        </Tag>
      </Reveal>
      {lede && (
        <Reveal delay={180}>
          <p className={`lede mt-6 ${center ? "mx-auto" : ""}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
