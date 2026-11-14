"use client";

import { useTransition } from "react";
import { Controller, useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/schemas/settings";
import { HERO_IMAGES_FOLDER } from "@/lib/storage";
import type { StoreSettings } from "@/lib/types";
import { ImageManager } from "../../_components/image-manager";
import { saveSettingsAction } from "../_actions/save-settings";

type TextFieldConfig = {
  name: Path<SettingsFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  isMultiline?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

const CONTACT_FIELDS: TextFieldConfig[] = [
  {
    name: "whatsappNumber",
    label: "WhatsApp da loja",
    description: "Com DDD. Recebe os pedidos do carrinho.",
    placeholder: "(88) 99999-9999",
    inputMode: "tel",
  },
  { name: "instagramHandle", label: "Instagram", placeholder: "@virtus.store" },
  { name: "city", label: "Cidade", placeholder: "Porteiras-CE" },
  { name: "shippingNote", label: "Aviso de envio", placeholder: "Enviamos para todo o Brasil." },
];

const HOME_FIELDS: TextFieldConfig[] = [
  { name: "heroTitle", label: "Título principal", placeholder: "Vista sua melhor versão" },
  { name: "heroSubtitle", label: "Texto de apoio", isMultiline: true },
  {
    name: "promoText",
    label: "Faixa de promoção",
    description: "Aparece no topo do site em dourado. Deixe vazio para esconder.",
    placeholder: "Frete grátis acima de R$ 299",
  },
];

/** Formulário das configurações da loja. */
export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });

  function handleSubmit(values: SettingsFormValues) {
    startTransition(async () => {
      const result = await saveSettingsAction(values);
      if (result.success) {
        toast.success(result.message);
        form.reset(values);
      } else {
        toast.error(result.message ?? "Não foi possível salvar");
      }
    });
  }

  function renderField(config: TextFieldConfig) {
    return (
      <Controller
        key={config.name}
        name={config.name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`settings-${config.name}`}>{config.label}</FieldLabel>
            {config.isMultiline ? (
              <Textarea {...field} id={`settings-${config.name}`} rows={3} aria-invalid={fieldState.invalid} />
            ) : (
              <Input
                {...field}
                id={`settings-${config.name}`}
                placeholder={config.placeholder}
                inputMode={config.inputMode}
                aria-invalid={fieldState.invalid}
              />
            )}
            {config.description && <FieldDescription>{config.description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex max-w-xl flex-col gap-10">
      <FieldSet>
        <FieldLegend className="section-label">Contato</FieldLegend>
        <FieldGroup>{CONTACT_FIELDS.map(renderField)}</FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend className="section-label">Página inicial</FieldLegend>
        <FieldGroup>
          <Controller
            name="heroImageUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Foto do look</FieldLabel>
                <div className="max-w-40">
                  <ImageManager
                    value={field.value ? [field.value] : []}
                    onChange={(urls) => field.onChange(urls[0] ?? "")}
                    maxImages={1}
                    folder={HERO_IMAGES_FOLDER}
                    hint=""
                  />
                </div>
                <FieldDescription>
                  Aparece no quadro ao lado do título. Use uma foto vertical (4:5), de até 5 MB. Sem foto, a loja
                  mostra a capa de um produto em destaque. Depois de trocar, clique em Salvar.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {HOME_FIELDS.map(renderField)}
        </FieldGroup>
      </FieldSet>
      <div>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Salvando…" : "Salvar configurações"}
        </Button>
      </div>
    </form>
  );
}
