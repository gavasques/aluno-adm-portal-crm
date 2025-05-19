
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

// Schema de validação
const formSchema = z.object({
  platform: z.string().min(2, "Nome da plataforma é obrigatório"),
  link: z.string().url("Link inválido"),
  price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  priority: z.coerce.number().min(1, "Prioridade deve ser pelo menos 1"),
});

interface Checkout {
  id: string;
  platform: string;
  link: string;
  price: number;
  priority: number;
}

type CheckoutFormProps = {
  onSubmit: (data: Omit<Checkout, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<Checkout>;
};

const CheckoutForm = ({ onSubmit, onCancel, initialData }: CheckoutFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: initialData?.platform || "",
      link: initialData?.link || "https://",
      price: initialData?.price || 0,
      priority: initialData?.priority || 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plataforma de Pagamento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Hotmart, Kiwify, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do Checkout</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://" />
              </FormControl>
              <FormDescription>
                Link direto para a página de pagamento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="1"
                    min="1"
                  />
                </FormControl>
                <FormDescription>
                  Ordem de exibição (1 = mais importante)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CheckoutForm;
