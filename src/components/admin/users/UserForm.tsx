
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Schema para validação do formulário
const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string({ required_error: "Selecione um papel" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).optional(),
});

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      password: "", // Campo adicionado para senha
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Enviando dados:", data);

      // Gerar uma senha aleatória se não for fornecida
      const password = data.password || Math.random().toString(36).slice(-10);

      // Chamar a edge function para criar um novo usuário
      const { data: response, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'createUser',
          email: data.email,
          name: data.name,
          role: data.role,
          password: password
        }
      });

      if (error) {
        console.error("Erro na chamada da função:", error);
        throw new Error(error.message || "Erro ao adicionar usuário");
      }
      
      if (response && response.error) {
        console.error("Erro retornado pela função:", response.error);
        throw new Error(response.error);
      }
      
      let message = "Usuário adicionado com sucesso";
      if (response.existed) {
        message = `O usuário ${data.email} já existe no sistema`;
      } else {
        message = `Um email de definição de senha foi enviado para ${data.email}`;
      }
      
      toast({
        title: "Usuário processado com sucesso",
        description: message,
      });
      
      form.reset();
      onSuccess();
      
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
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
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Student">Aluno</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha (opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Deixe em branco para gerar uma senha aleatória" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
