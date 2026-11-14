import { z } from "zod";

/** Schema das configurações da loja editáveis no painel VIP. */
export const settingsFormSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]*$/, "Use apenas números, espaços, parênteses ou hífen")
    .refine((value) => value === "" || value.replace(/\D/g, "").length >= 10, "Número incompleto (inclua o DDD)"),
  instagramHandle: z
    .string()
    .trim()
    .regex(/^@?[\w.]*$/, "Use apenas letras, números, ponto e _")
    .max(31),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  shippingNote: z.string().trim().max(160),
  heroTitle: z.string().trim().min(2, "Informe o título").max(60),
  heroSubtitle: z.string().trim().max(200),
  promoText: z.string().trim().max(120),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
