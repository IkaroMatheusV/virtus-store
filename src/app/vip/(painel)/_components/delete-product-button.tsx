"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "../_actions/delete-product";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

/** Excluir produto com confirmação (sugere ocultar como alternativa). */
export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction({ id: productId });
      if (result.success) toast.success("Produto excluído");
      else toast.error(result.message ?? "Não foi possível excluir");
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Excluir ${productName}`} disabled={isPending}>
          <Trash2 strokeWidth={1.5} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-sm border-border bg-graphite">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{productName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            O produto e as fotos serão apagados definitivamente. Se quiser só tirar da loja por um tempo, desligue
            “Visível”.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-virtus-black hover:bg-destructive/80">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
