"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_ITEM_QUANTITY } from "@/lib/cart";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  /** Permite chegar a 0 (usado no carrinho para remover). */
  min?: number;
  /** Limite superior (estoque); padrão: limite do carrinho. */
  max?: number;
  size?: "sm" | "default";
};

/** Controle de quantidade com botões − / +. */
export function QuantityStepper({
  value,
  onChange,
  ariaLabelledBy,
  ariaLabel,
  min = 1,
  max = MAX_ITEM_QUANTITY,
  size = "default",
}: QuantityStepperProps) {
  const buttonClass = cn(
    "inline-flex items-center justify-center text-silver transition-colors hover:text-gold disabled:opacity-40",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      role="group"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className="inline-flex w-fit! items-center rounded-sm border border-concrete"
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <output aria-live="polite" className={cn("min-w-8 text-center font-heading text-sm font-medium", size === "sm" && "min-w-6")}>
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
