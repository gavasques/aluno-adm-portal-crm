
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

const userInviteSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string({ required_error: "Selecione um papel" }),
});

interface UserInviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(userInviteSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Enviando convite:", data);

      // Tentar chamar a edge function para convidar um novo usuário
      try {
        const { data: response, error } = await supabase.functions.invoke('list-users', {
          method: 'POST',
          body: {
            action: 'inviteUser',
            email: data.email,
            name: data.name,
            role: data.role
          }
        });

        if (error) {
          console.error("Erro na chamada da função:", error);
          throw new Error(error.message || "Erro ao enviar convite");
        }
        
        if (response && response.error) {
          console.error("Erro retornado pela função:", response.error);
          throw new Error(response.error);
        }
        
        let message = "Convite enviado com sucesso";
        if (response && response.existed) {
          message = `O usuário ${data.email} já existe no sistema`;
        } else {
          message = `Um email de convite foi enviado para ${data.email}`;
        }
        
        toast({
          title: "Convite processado com sucesso",
          description: message,
        });
      } catch (functionError) {
        console.error("Erro ao chamar a edge function:", functionError);
        
        // Implementação alternativa: cadastrar diretamente através da API de autenticação
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          email_confirm: false,
          user_metadata: {
            name: data.name,
            role: data.role,
            status: 'Convidado'
          }
        });
        
        if (authError) {
          console.error("Erro ao criar usuário diretamente:", authError);
          throw new Error(authError.message || "Erro ao criar usuário");
        }
        
        toast({
          title: "Usuário convidado com sucesso",
          description: `Usuário ${data.email} foi cadastrado com status de convidado.`,
        });
      }
      
      form.reset();
      onSuccess();
      
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o convite. Tente novamente.",
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
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Convite"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserInviteForm;
