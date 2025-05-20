
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Dados de exemplo para categorias
const CATEGORIES = [
  { id: 1, name: "Produtos Diversos" },
  { id: 2, name: "Eletrônicos" },
  { id: 3, name: "Vestuário" },
  { id: 4, name: "Tecnologia" },
  { id: 5, name: "Sustentáveis" },
];

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  categoryId: z.coerce.number().min(1, "A categoria é obrigatória"),
  cnpj: z.string().min(1, "O CNPJ é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  website: z.string().optional(),
  address: z.string().min(1, "O endereço é obrigatório"),
  logo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  supplier?: any;
  onSubmit: (data: any) => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: supplier ? {
      name: supplier.name || "",
      categoryId: supplier.categoryId || "",
      cnpj: supplier.cnpj || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      website: supplier.website || "",
      address: supplier.address || "",
      logo: supplier.logo || "",
    } : {
      name: "",
      categoryId: "",
      cnpj: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      logo: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    // Busca o nome da categoria com base no ID
    const category = CATEGORIES.find(cat => cat.id === data.categoryId)?.name || "";
    
    // Mantém os valores existentes que não estão no formulário (como avaliações e comentários)
    const updatedData = {
      ...supplier,
      ...data,
      category, // Adiciona o nome da categoria
      rating: supplier?.rating || 0,
      comments: supplier?.comments || 0,
    };
    
    onSubmit(updatedData);
    toast.success(supplier ? "Fornecedor atualizado com sucesso!" : "Fornecedor adicionado com sucesso!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do fornecedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@fornecedor.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="www.fornecedor.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Iniciais do Logo (2 letras)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: DN" 
                    maxLength={2}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.substring(0, 2).toUpperCase();
                      e.target.value = value;
                      field.onChange(e);
                    }} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit">
            {supplier ? "Atualizar Fornecedor" : "Adicionar Fornecedor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
