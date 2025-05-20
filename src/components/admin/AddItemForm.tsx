
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemFormProps {
  onSubmit: (data: FormValues) => void;
  itemName: string;
  showDescription?: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onSubmit, itemName, showDescription = false }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
    toast.success(`${itemName} adicionado com sucesso!`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder={`Digite o nome do ${itemName.toLowerCase()}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showDescription && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder={`Digite uma descrição para o ${itemName.toLowerCase()}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Adicionar {itemName}</Button>
      </form>
    </Form>
  );
};

export default AddItemForm;
