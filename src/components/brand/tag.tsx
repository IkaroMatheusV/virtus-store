import { cn } from "@/lib/utils";

/** Selo pequeno com contorno dourado ("NOVO", "OFERTA"). */
export function Tag({ className, variant = "outline", ...props }: React.ComponentProps<"span"> & { variant?: "outline" | "solid" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-sm border border-gold px-2 font-heading text-[0.625rem] font-medium uppercase tracking-[0.25em]",
        variant === "solid" ? "bg-gold text-virtus-black" : "bg-virtus-black/80 text-gold",
        className,
      )}
      {...props}
    />
  );
}
