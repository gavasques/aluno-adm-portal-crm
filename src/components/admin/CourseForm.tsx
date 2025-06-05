
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, CourseStatus } from "@/types/course.types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

// Schema de validação
const formSchema = z.object({
  name: z.string().min(3, "O nome do curso deve ter pelo menos 3 caracteres"),
  status: z.enum(["active", "inactive", "coming_soon"] as const),
  platform: z.string().min(2, "Nome da plataforma é obrigatório"),
  platformLink: z.string().url("Link inválido"),
  salesPageLink: z.string().url("Link inválido"),
  accessPeriod: z.coerce.number().min(1, "Período mínimo de 1 dia"),
  price: z.coerce.number().min(0, "O preço não pode ser negativo"),
});

type CourseFormProps = {
  onSubmit: (data: Omit<Course, "id" | "createdAt" | "courseId">) => void;
  onCancel: () => void;
  initialData?: Partial<Course>;
};

const CourseForm = ({ onSubmit, onCancel, initialData }: CourseFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      status: initialData?.status || "active",
      platform: initialData?.platform || "",
      platformLink: initialData?.platformLink || "https://",
      salesPageLink: initialData?.salesPageLink || "https://",
      accessPeriod: initialData?.accessPeriod || 365,
      price: initialData?.price || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {initialData?.courseId && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
            <span className="font-medium text-sm text-gray-600">ID:</span>
            <span className="text-sm">{initialData.courseId}</span>
            <span className="text-xs text-gray-400 ml-auto">(Gerado automaticamente)</span>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Curso</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome do curso" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="coming_soon">Em Breve</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plataforma</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Hotmart, Kiwify, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <FormField
          control={form.control}
          name="platformLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link da Plataforma</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://" />
              </FormControl>
              <FormDescription>
                Link direto para o curso na plataforma de hospedagem
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salesPageLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Página de Vendas</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://" />
              </FormControl>
              <FormDescription>
                Link para a página de vendas do curso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Período de Acesso (dias)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="365"
                  min="1"
                />
              </FormControl>
              <FormDescription>
                Tempo que o aluno terá acesso ao curso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default CourseForm;
