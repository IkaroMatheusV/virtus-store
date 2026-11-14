"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/schemas/checkout";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem } from "@/lib/cart";

type CheckoutFormProps = {
  items: CartItem[];
  whatsappNumber: string;
};

/** Coleta nome e cidade e abre o WhatsApp da loja com o pedido pronto. */
export function CheckoutForm({ items, whatsappNumber }: CheckoutFormProps) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { name: "", city: "", note: "" },
  });

  const canCheckout = whatsappNumber.length > 0;

  function handleSubmit(values: CheckoutFormValues) {
    const message = buildOrderMessage(items, values);
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-5">
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="checkout-name">Seu nome</FieldLabel>
              <Input {...field} id="checkout-name" autoComplete="name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="checkout-city">Cidade / UF</FieldLabel>
              <Input
                {...field}
                id="checkout-city"
                autoComplete="address-level2"
                placeholder="Ex.: Juazeiro do Norte-CE"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="checkout-note">Observação (opcional)</FieldLabel>
              <Textarea
                {...field}
                id="checkout-note"
                rows={3}
                placeholder="Forma de pagamento, entrega, dúvidas…"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full" disabled={!canCheckout}>
        <MessageCircle data-icon="inline-start" strokeWidth={1.5} />
        Finalizar no WhatsApp
      </Button>
      {!canCheckout && (
        <p className="text-center text-xs text-silver-muted">
          O WhatsApp da loja ainda não foi configurado no painel VIP.
        </p>
      )}
    </form>
  );
}
