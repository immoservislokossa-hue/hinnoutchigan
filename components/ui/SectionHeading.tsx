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
          <span className={`eyebrow ${dark ? "" : ""}`}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={90}>
        <Tag
          className={`h-display mt-5 text-[clamp(1.75rem,7.5vw,2.25rem)] sm:text-5xl lg:text-[3.4rem] ${dark ? "text-green-900" : "text-green-900"}`}
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
