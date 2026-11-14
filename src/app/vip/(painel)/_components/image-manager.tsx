"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/storage";

type ImageManagerProps = {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages: number;
  /** Pasta do Storage onde as fotos são salvas. Padrão: "products". */
  folder?: string;
  /** Dica exibida abaixo das fotos. */
  hint?: string;
};

/** Upload, remoção e escolha da foto de capa (a primeira da lista). */
export function ImageManager({
  value,
  onChange,
  maxImages,
  folder = "products",
  hint = `Até ${maxImages} fotos (JPG, PNG ou WEBP, máx. 5 MB). Use fundo de concreto e formato 4:5 ou quadrado.`,
}: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, isUploading } = useImageUpload();
  const canAddMore = value.length < maxImages;

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, maxImages - value.length);
    event.target.value = "";
    if (files.length === 0) return;

    const { urls, errors } = await uploadImages(files, folder);
    if (urls.length > 0) onChange([...value, ...urls]);
    errors.forEach((message) => toast.error(message));
  }

  function handleRemove(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  function handleMakeCover(url: string) {
    onChange([url, ...value.filter((item) => item !== url)]);
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className={maxImages === 1 ? "grid grid-cols-1" : "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"}>
        {value.map((url, index) => (
          <li key={url} className="group relative">
            <div className="concrete-surface relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
              <Image src={url} alt={`Foto ${index + 1}`} fill sizes="160px" className="object-cover" />
            </div>
            {maxImages === 1 ? null : index === 0 ? (
              <span className="absolute bottom-1 left-1 rounded-sm bg-gold px-1.5 font-heading text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-virtus-black">
                Capa
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleMakeCover(url)}
                className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded-sm bg-virtus-black/80 px-1.5 py-0.5 text-[0.625rem] text-silver hover:text-gold"
              >
                <ArrowLeft className="size-3" /> Capa
              </button>
            )}
            <button
              type="button"
              onClick={() => handleRemove(url)}
              aria-label={`Remover foto ${index + 1}`}
              className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-sm bg-virtus-black/80 text-silver hover:text-gold"
            >
              <X className="size-4" />
            </button>
          </li>
        ))}

        {canAddMore && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-concrete text-silver-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
            >
              {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" strokeWidth={1.5} />}
              <span className="text-xs">{isUploading ? "Enviando…" : "Adicionar"}</span>
            </button>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple={maxImages > 1}
        hidden
        onChange={handleFilesSelected}
      />
      {hint && <p className="text-xs text-silver-muted">{hint}</p>}
    </div>
  );
}
