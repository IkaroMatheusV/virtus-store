import type { NextConfig } from "next";

/** Host do Supabase Storage (fotos dos produtos), derivado da URL do projeto. */
function getSupabaseImagePattern(): URL[] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return [];
  return [new URL("/storage/v1/object/public/**", supabaseUrl)];
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: getSupabaseImagePattern(),
  },
};

export default nextConfig;
