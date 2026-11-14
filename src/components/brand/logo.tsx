import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Emblema oficial (PNG transparente em /public). */
export const LOGO_SRC = "/logo.png";
const LOGO_WIDTH_PX = 788;
const LOGO_HEIGHT_PX = 1004;

type LogoSize = "sm" | "md" | "lg";

/** Altura do emblema e tamanho do nome para cada tamanho de logo. */
const SIZE_STYLES: Record<LogoSize, { emblem: string; name: string; tagline: string; gap: string }> = {
  sm: { emblem: "h-8", name: "text-sm tracking-[0.3em]", tagline: "text-[0.5rem] tracking-[0.45em]", gap: "gap-2.5" },
  md: { emblem: "h-11", name: "text-lg tracking-[0.32em]", tagline: "text-[0.55rem] tracking-[0.5em]", gap: "gap-3" },
  lg: { emblem: "h-14", name: "text-xl tracking-[0.34em]", tagline: "text-[0.6rem] tracking-[0.55em]", gap: "gap-3.5" },
};

type LogoProps = {
  /** Tamanho da logo. Padrão: "md". */
  size?: LogoSize;
  /** Mostra o nome "Virtus Store" ao lado do emblema. Padrão: true. */
  hasWordmark?: boolean;
  className?: string;
  href?: string;
};

/** Logo da Virtus: emblema VS dourado + nome, sempre sobre fundo escuro. */
export function Logo({ size = "md", hasWordmark = true, className, href = "/" }: LogoProps) {
  const styles = SIZE_STYLES[size];
  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center", styles.gap, className)}
      aria-label="Virtus Store — início"
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={LOGO_WIDTH_PX}
        height={LOGO_HEIGHT_PX}
        sizes="48px"
        priority
        className={cn("w-auto", styles.emblem)}
      />
      {hasWordmark && (
        <span className="flex flex-col font-heading leading-none uppercase" aria-hidden="true">
          <span className={cn("font-light text-silver", styles.name)}>Virtus</span>
          <span className={cn("mt-1 font-medium text-gold", styles.tagline)}>Store</span>
        </span>
      )}
    </Link>
  );
}
