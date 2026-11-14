import { cn } from "@/lib/utils";

/** Rótulo de seção em ouro (Montserrat 14px · 0.3em). */
export function SectionLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("section-label", className)} {...props} />;
}
