"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldTitle } from "@/components/ui/field";
import { useCart } from "@/hooks/use-cart";
import { getEffectivePrice } from "@/lib/format-price";
import { createAddToCartSchema, type AddToCartValues } from "@/lib/schemas/add-to-cart";
import { getMaxQuantity, getSizeStock, getSoldOutSizes, isSoldOut, LOW_STOCK_THRESHOLD } from "@/lib/stock";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";
import { OptionChips } from "./option-chips";
import { QuantityStepper } from "@/components/cart/quantity-stepper";

type AddToCartFormProps = {
  product: Product;
  whatsappNumber: string;
};

/** Escolha de tamanho, cor e quantidade; adiciona ao carrinho ou pergunta direto no WhatsApp. */
export function AddToCartForm({ product, whatsappNumber }: AddToCartFormProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const schema = useMemo(
    () => createAddToCartSchema({ sizes: product.sizes, colors: product.colors, stock: product.stock }),
    [product.sizes, product.colors, product.stock],
  );

  const soldOutSizes = getSoldOutSizes(product);
  const availableSizes = product.sizes.filter((size) => !soldOutSizes.includes(size));

  const form = useForm<AddToCartValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      size: availableSizes.length === 1 ? availableSizes[0] : "",
      color: product.colors.length === 1 ? product.colors[0] : "",
      quantity: 1,
    },
  });

  const selectedSize = useWatch({ control: form.control, name: "size" });
  const maxQuantity = getMaxQuantity(product, selectedSize || null);
  const selectedSizeStock = selectedSize ? getSizeStock(product, selectedSize) : null;
  const hasLowStock = selectedSizeStock !== null && selectedSizeStock > 0 && selectedSizeStock <= LOW_STOCK_THRESHOLD;
  const unitPrice = getEffectivePrice(product.price, product.promoPrice);

  if (isSoldOut(product)) {
    return <SoldOutActions productName={product.name} whatsappNumber={whatsappNumber} />;
  }

  function handleSizeChange(size: string, onChange: (value: string) => void) {
    onChange(size);
    // Ao trocar de tamanho, a quantidade não pode passar das peças disponíveis.
    const limit = getMaxQuantity(product, size);
    if (form.getValues("quantity") > limit) form.setValue("quantity", limit);
  }

  function handleAddToCart(values: AddToCartValues) {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? null,
      size: values.size || null,
      color: values.color || null,
      unitPrice,
      quantity: values.quantity,
      maxQuantity: product.stock === null ? undefined : getMaxQuantity(product, values.size || null),
    });
    toast.success("Adicionado ao carrinho", {
      description: product.name,
      action: { label: "Ver carrinho", onClick: () => router.push("/carrinho") },
    });
  }

  function handleBuyNow(values: AddToCartValues) {
    const message = buildOrderMessage([
      { name: product.name, size: values.size || null, color: values.color || null, quantity: values.quantity, unitPrice },
    ]);
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={form.handleSubmit(handleAddToCart)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-6">
        {product.sizes.length > 0 && (
          <Controller
            name="size"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldTitle id="tamanho-label" className="section-label text-[0.6875rem]">
                  Tamanho
                </FieldTitle>
                <OptionChips
                  options={product.sizes}
                  value={field.value}
                  onChange={(size) => handleSizeChange(size, field.onChange)}
                  ariaLabelledBy="tamanho-label"
                  isInvalid={fieldState.invalid}
                  disabledOptions={soldOutSizes}
                />
                {hasLowStock && (
                  <p className="text-sm text-gold" aria-live="polite">
                    {selectedSizeStock === 1 ? "Última peça" : `Últimas ${selectedSizeStock} peças`} nesse tamanho
                  </p>
                )}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        {product.colors.length > 0 && (
          <Controller
            name="color"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldTitle id="cor-label" className="section-label text-[0.6875rem]">
                  Cor
                </FieldTitle>
                <OptionChips
                  options={product.colors}
                  value={field.value}
                  onChange={field.onChange}
                  ariaLabelledBy="cor-label"
                  isInvalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          name="quantity"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldTitle id="quantidade-label" className="section-label text-[0.6875rem]">
                Quantidade
              </FieldTitle>
              <QuantityStepper
                value={field.value}
                onChange={field.onChange}
                max={maxQuantity}
                ariaLabelledBy="quantidade-label"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" className="w-full">
          <ShoppingBag data-icon="inline-start" strokeWidth={1.5} />
          Adicionar ao carrinho
        </Button>
        {whatsappNumber ? (
          <Button type="button" size="lg" variant="outline" className="w-full" onClick={form.handleSubmit(handleBuyNow)}>
            <MessageCircle data-icon="inline-start" strokeWidth={1.5} />
            Comprar pelo WhatsApp
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/carrinho">Ir para o carrinho</Link>
          </Button>
        )}
      </div>
    </form>
  );
}

type SoldOutActionsProps = {
  productName: string;
  whatsappNumber: string;
};

/** Produto sem nenhuma peça: botão desabilitado e convite para perguntar sobre reposição. */
function SoldOutActions({ productName, whatsappNumber }: SoldOutActionsProps) {
  const message = `Olá! O produto "${productName}" vai voltar ao estoque?`;
  return (
    <div className="flex flex-col gap-3">
      <Button type="button" size="lg" className="w-full" disabled>
        Esgotado
      </Button>
      {whatsappNumber && (
        <Button asChild size="lg" variant="outline" className="w-full">
          <a href={buildWhatsAppUrl(whatsappNumber, message)} target="_blank" rel="noopener noreferrer">
            <MessageCircle data-icon="inline-start" strokeWidth={1.5} />
            Avisar quando chegar
          </a>
        </Button>
      )}
    </div>
  );
}
