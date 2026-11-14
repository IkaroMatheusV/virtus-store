"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, PRODUCT_IMAGES_BUCKET } from "@/lib/storage";

type UploadResult = { urls: string[]; errors: string[] };

function getExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 4) return fromName;
  return file.type.split("/")[1] ?? "jpg";
}

/**
 * Envia fotos direto do navegador para o Supabase Storage usando a sessão do dono.
 * O RLS do bucket só permite upload para usuários VIP.
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImages(files: File[], folder = "products"): Promise<UploadResult> {
    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    const result: UploadResult = { urls: [], errors: [] };

    try {
      for (const file of files) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
          result.errors.push(`${file.name}: use JPG, PNG ou WEBP`);
          continue;
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          result.errors.push(`${file.name}: máximo de 5 MB`);
          continue;
        }

        const path = `${folder}/${crypto.randomUUID()}.${getExtension(file)}`;
        const { error } = await supabase.storage
          .from(PRODUCT_IMAGES_BUCKET)
          .upload(path, file, { cacheControl: "31536000", contentType: file.type });

        if (error) {
          result.errors.push(`${file.name}: ${error.message}`);
          continue;
        }
        result.urls.push(supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl);
      }
    } finally {
      setIsUploading(false);
    }

    return result;
  }

  return { uploadImages, isUploading };
}
