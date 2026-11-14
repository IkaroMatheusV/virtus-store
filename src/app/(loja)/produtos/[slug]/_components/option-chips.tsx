"use client";

import { cn } from "@/lib/utils";

type OptionChipsProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabelledBy: string;
  isInvalid?: boolean;
};

/** Grupo de opções (tamanho/cor) com semântica de radiogroup. */
export function OptionChips({ options, value, onChange, ariaLabelledBy, isInvalid = false }: OptionChipsProps) {
  return (
    <div role="radiogroup" aria-labelledby={ariaLabelledBy} aria-invalid={isInvalid} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option)}
            className={cn(
              "inline-flex h-10 min-w-12 items-center justify-center rounded-sm border px-3 font-heading text-xs uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
              isSelected
                ? "border-gold bg-gold/10 text-gold"
                : "border-concrete text-silver hover:border-silver-muted",
              isInvalid && !isSelected && "border-destructive/60",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
