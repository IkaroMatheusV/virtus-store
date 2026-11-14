"use client";

import { cn } from "@/lib/utils";

type OptionChipsProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabelledBy: string;
  isInvalid?: boolean;
  /** Opções esgotadas: aparecem riscadas e não podem ser escolhidas. */
  disabledOptions?: string[];
};

/** Grupo de opções (tamanho/cor) com semântica de radiogroup. */
export function OptionChips({
  options,
  value,
  onChange,
  ariaLabelledBy,
  isInvalid = false,
  disabledOptions = [],
}: OptionChipsProps) {
  return (
    <div role="radiogroup" aria-labelledby={ariaLabelledBy} aria-invalid={isInvalid} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option === value;
        const isDisabled = disabledOptions.includes(option);
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => onChange(option)}
            aria-label={isDisabled ? `${option}, esgotado` : undefined}
            className={cn(
              "inline-flex h-10 min-w-12 items-center justify-center rounded-sm border px-3 font-heading text-xs uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
              isSelected
                ? "border-gold bg-gold/10 text-gold"
                : "border-concrete text-silver hover:border-silver-muted",
              isInvalid && !isSelected && !isDisabled && "border-destructive/60",
              isDisabled && "cursor-not-allowed border-dashed text-silver-muted/50 line-through hover:border-concrete",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
