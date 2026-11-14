import { SectionLabel } from "@/components/brand/section-label";
import { getStoreSettings } from "@/services/catalog";
import { SettingsForm } from "./_components/settings-form";

/** Configurações da loja: contato e textos da página inicial. */
export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <SectionLabel>Loja</SectionLabel>
        <h1 className="heading-display text-3xl">Configurações</h1>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
