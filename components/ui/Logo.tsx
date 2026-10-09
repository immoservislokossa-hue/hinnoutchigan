import Image from "next/image";

export function Logo({ size = 56, priority = false, className = "" }: { size?: number; priority?: boolean; className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="Logo du Sénat des Jeunes du Bénin"
      width={size}
      height={Math.round((size * 708) / 680)}
      priority={priority}
      className={className}
    />
  );
}
