"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TagsInputProps = {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  /** Atalhos clicáveis (ex.: P, M, G, GG). */
  suggestions: string[];
  placeholder: string;
  isInvalid?: boolean;
};

/** Lista editável de valores curtos (tamanhos, cores) com sugestões rápidas. */
export function TagsInput({ id, value, onChange, suggestions, placeholder, isInvalid = false }: TagsInputProps) {
  const [draft, setDraft] = useState("");

  function handleAdd(rawValue: string) {
    const tag = rawValue.trim();
    if (!tag || value.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function handleRemove(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAdd(draft);
    }
  }

  const remainingSuggestions = suggestions.filter((suggestion) => !value.includes(suggestion));

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selecionados">
          {value.map((tag) => (
            <li key={tag}>
              <span className="inline-flex h-8 items-center gap-1 rounded-sm border border-gold bg-gold/10 pl-3 pr-1 font-heading text-xs uppercase tracking-[0.1em] text-gold">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemove(tag)}
                  aria-label={`Remover ${tag}`}
                  className="inline-flex size-6 items-center justify-center text-gold/80 hover:text-gold-light"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          className="max-w-60"
        />
        <button
          type="button"
          onClick={() => handleAdd(draft)}
          aria-label="Adicionar"
          className="inline-flex size-10 items-center justify-center rounded-sm border border-concrete text-silver hover:border-gold hover:text-gold"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remainingSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAdd(suggestion)}
              className={cn(
                "inline-flex h-7 items-center rounded-sm border border-dashed border-concrete px-2.5 text-xs text-silver-muted transition-colors hover:border-silver-muted hover:text-silver",
              )}
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
