import { cn } from "@/lib/utils";

/** Linha fina dourada usada como divisor (sem sombras ou degradês). */
export function GoldDivider({ className }: { className?: string }) {
  return <hr className={cn("h-px border-0 bg-gold/40", className)} />;
}
