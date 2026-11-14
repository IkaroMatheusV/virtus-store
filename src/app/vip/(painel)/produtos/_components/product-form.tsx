"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MAX_IMAGES, productFormSchema, type ProductFormValues } from "@/lib/schemas/product";
import type { Category, Product } from "@/lib/types";
import { saveProductAction } from "../_actions/save-product";
import { ImageManager } from "../../_components/image-manager";
import { StockFields } from "./stock-fields";
import { TagsInput } from "./tags-input";

const SIZE_SUGGESTIONS = ["P", "M", "G", "GG", "XG", "38", "40", "42", "44", "46", "Único"];
const COLOR_SUGGESTIONS = ["Preto", "Branco", "Cinza", "Bege", "Verde-oliva", "Azul marinho"];

type ProductFormProps = {
  categories: Category[];
  /** Ausente = cadastro novo. */
  product?: Product;
};

function toFormMoney(value: number | null): string {
  return value === null ? "" : value.toFixed(2).replace(".", ",");
}

function getDefaultValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    price: toFormMoney(product?.price ?? null),
    promoPrice: toFormMoney(product?.promoPrice ?? null),
    sizes: product?.sizes ?? [],
    colors: product?.colors ?? [],
    images: product?.images ?? [],
    // Produto novo já nasce com controle de estoque; os antigos só se já tiverem.
    trackStock: product ? product.stock !== null : true,
    stock: product?.stock ?? {},
    isNew: product?.isNew ?? true,
    isFeatured: product?.isFeatured ?? false,
    isActive: product?.isActive ?? true,
  };
}

/** Formulário de cadastro/edição de produto do painel VIP. */
export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product),
  });
  const sizes = useWatch({ control: form.control, name: "sizes" });
  const isTrackingStock = useWatch({ control: form.control, name: "trackStock" });

  function handleSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result = await saveProductAction(values, product?.id);
      if (!result.success) {
        Object.entries(result.errors ?? {}).forEach(([field, messages]) => {
          if (messages?.[0]) form.setError(field as keyof ProductFormValues, { message: messages[0] });
        });
        toast.error(result.message ?? "Não foi possível salvar");
        return;
      }
      toast.success(result.message);
      if (product) form.reset(values);
      else router.push("/vip");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-10">
      <FieldSet>
        <FieldLegend className="section-label">Informações</FieldLegend>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-name">Nome</FieldLabel>
                <Input {...field} id="product-name" placeholder="Ex.: Camiseta básica premium" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="product-category" aria-invalid={fieldState.invalid} className="h-10 w-full sm:max-w-xs">
                    <SelectValue placeholder="Escolha a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2 sm:max-w-md">
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">Preço (R$)</FieldLabel>
                  <Input {...field} id="product-price" inputMode="decimal" placeholder="65,00" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="promoPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-promo-price">Preço promocional</FieldLabel>
                  <Input
                    {...field}
                    id="product-promo-price"
                    inputMode="decimal"
                    placeholder="Opcional"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-description">Descrição</FieldLabel>
                <Textarea
                  {...field}
                  id="product-description"
                  rows={4}
                  placeholder="Tecido, caimento, detalhes…"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="section-label">Fotos</FieldLegend>
        <Controller
          name="images"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <ImageManager value={field.value} onChange={field.onChange} maxImages={MAX_IMAGES} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldSet>

      <FieldSet>
        <FieldLegend className="section-label">Variações</FieldLegend>
        <FieldGroup>
          <Controller
            name="sizes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-sizes">Tamanhos</FieldLabel>
                <TagsInput
                  id="product-sizes"
                  value={field.value}
                  onChange={field.onChange}
                  suggestions={SIZE_SUGGESTIONS}
                  placeholder="Digite e tecle Enter"
                  isInvalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="colors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-colors">Cores</FieldLabel>
                <TagsInput
                  id="product-colors"
                  value={field.value}
                  onChange={field.onChange}
                  suggestions={COLOR_SUGGESTIONS}
                  placeholder="Digite e tecle Enter"
                  isInvalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="section-label">Estoque</FieldLegend>
        <FieldGroup className="gap-5">
          <Controller
            name="trackStock"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="max-w-md">
                <FieldContent>
                  <FieldLabel htmlFor="product-trackStock">Controlar quantidade de peças</FieldLabel>
                  <FieldDescription>
                    Informe quantas peças tem de cada tamanho. Ao vender pelo WhatsApp, baixe a quantidade aqui.
                  </FieldDescription>
                </FieldContent>
                <Switch id="product-trackStock" checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          {isTrackingStock && (
            <Controller
              name="stock"
              control={form.control}
              render={({ field, formState }) => (
                <StockFields
                  sizes={sizes}
                  value={field.value}
                  onChange={field.onChange}
                  errors={Object.fromEntries(
                    Object.entries(formState.errors.stock ?? {}).map(([size, error]) => [
                      size,
                      (error as { message?: string } | undefined)?.message,
                    ]),
                  )}
                />
              )}
            />
          )}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="section-label">Exibição</FieldLegend>
        <FieldGroup className="gap-4">
          {(
            [
              { name: "isActive", label: "Visível na loja", description: "Desligue para esconder sem excluir." },
              { name: "isFeatured", label: "Destaque", description: "Aparece primeiro na página inicial." },
              { name: "isNew", label: "Selo “Novo”", description: "Mostra o selo dourado no card." },
            ] as const
          ).map((option) => (
            <Controller
              key={option.name}
              name={option.name}
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal" className="max-w-md">
                  <FieldContent>
                    <FieldLabel htmlFor={`product-${option.name}`}>{option.label}</FieldLabel>
                    <FieldDescription>{option.description}</FieldDescription>
                  </FieldContent>
                  <Switch id={`product-${option.name}`} checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />
          ))}
        </FieldGroup>
      </FieldSet>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-border bg-virtus-black/95 px-4 py-4 sm:flex-row sm:justify-end md:-mx-8 md:px-8">
        <Button asChild variant="ghost">
          <Link href="/vip">Cancelar</Link>
        </Button>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Salvando…" : product ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
      </div>
    </form>
  );
}
