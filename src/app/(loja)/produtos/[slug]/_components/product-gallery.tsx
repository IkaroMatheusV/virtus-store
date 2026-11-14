"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

/** Galeria: foto principal 4:5 e miniaturas clicáveis. */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? null;

  return (
    <div className="flex flex-col gap-3">
      <ProductImage
        src={activeImage}
        alt={name}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
        className="rounded-sm border border-border"
      />
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1} de ${images.length}`}
                aria-current={index === activeIndex}
                className={cn(
                  "concrete-surface relative block aspect-[4/5] w-full overflow-hidden rounded-sm border transition-colors",
                  index === activeIndex ? "border-gold" : "border-border hover:border-silver-muted",
                )}
              >
                <Image src={image} alt="" fill sizes="10vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
