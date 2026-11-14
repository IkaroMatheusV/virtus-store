import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  /** Valor do atributo sizes do next/image. */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Foto do produto em 4:5 sobre fundo de concreto; sem foto mostra o placeholder da marca. */
export function ProductImage({ src, alt, sizes, priority = false, className }: ProductImageProps) {
  return (
    <div className={cn("concrete-surface relative aspect-[4/5] w-full overflow-hidden", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-silver/40" aria-hidden>
          <span className="font-heading text-3xl font-light tracking-[0.2em]">VS</span>
          <span className="font-heading text-[0.625rem] uppercase tracking-[0.3em]">Foto em breve</span>
        </div>
      )}
    </div>
  );
}
