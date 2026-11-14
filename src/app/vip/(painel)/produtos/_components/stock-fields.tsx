"use client";

import { Input } from "@/components/ui/input";
import { MAX_STOCK_PER_SIZE } from "@/lib/stock";
import { cn } from "@/lib/utils";

type StockFieldsProps = {
  sizes: string[];
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  /** Mensagens de erro por tamanho. */
  errors?: Partial<Record<string, string>>;
};

/** Converte o texto digitado em quantidade inteira (vazio = 0). */
function toQuantity(rawValue: string): number {
  const digits = rawValue.replace(/\D/g, "");
  return digits === "" ? 0 : Math.min(MAX_STOCK_PER_SIZE, Number(digits));
}

/** Uma caixa de quantidade para cada tamanho cadastrado. */
export function StockFields({ sizes, value, onChange, errors = {} }: StockFieldsProps) {
  if (sizes.length === 0) {
    return <p className="text-sm text-silver-muted">Adicione os tamanhos acima para informar as quantidades.</p>;
  }

  const total = sizes.reduce((sum, size) => sum + (value[size] ?? 0), 0);

  function handleChange(size: string, rawValue: string) {
    onChange({ ...value, [size]: toQuantity(rawValue) });
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {sizes.map((size) => {
          const quantity = value[size] ?? 0;
          const error = errors[size];
          return (
            <li key={size} className="flex flex-col gap-1.5">
              <label
                htmlFor={`stock-${size}`}
                className="font-heading text-xs uppercase tracking-[0.15em] text-silver"
              >
                {size}
              </label>
              <Input
                id={`stock-${size}`}
                inputMode="numeric"
                value={String(quantity)}
                onChange={(event) => handleChange(size, event.target.value)}
                onFocus={(event) => event.target.select()}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `stock-${size}-error` : undefined}
                className={cn("text-center", quantity === 0 && "text-destructive")}
              />
              {error && (
                <p id={`stock-${size}-error`} className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-silver-muted">
        Total: <span className="text-silver">{total} {total === 1 ? "peça" : "peças"}</span>. Tamanho com 0 aparece
        como esgotado na loja.
      </p>
    </div>
  );
}
