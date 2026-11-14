import { z } from "zod";

/** Login do dono da loja (acesso VIP). */
export const loginFormSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
