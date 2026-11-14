import { z } from "zod";

/** Dados pedidos ao cliente antes de enviar o pedido pelo WhatsApp. */
export const checkoutFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  city: z.string().trim().min(2, "Informe sua cidade").max(80),
  note: z.string().trim().max(300, "Observação muito longa"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
