
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
import { sanitizeError, logSecureError } from "@/utils/security";

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
      logSecureError({ ...data, role: data.role }, "User Invite");

      // Chamar a edge function para convidar um novo usuário
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
        logSecureError(error, "User Invite - Function Error");
        throw new Error(sanitizeError(error));
      }
      
      if (response && response.error) {
        logSecureError(response.error, "User Invite - Response Error");
        throw new Error(sanitizeError(response.error));
      }
      
      let message = "Convite enviado com sucesso";
      if (response && response.existed) {
        message = `O usuário ${data.email} já existe no sistema`;
      } else if (response && response.directCreation) {
        message = `Usuário criado diretamente. ${data.email} precisará usar a opção 'Esqueci minha senha'.`;
      } else {
        message = `Um email de convite foi enviado para ${data.email}`;
      }
      
      toast({
        title: "Convite processado com sucesso",
        description: message,
      });
      
      form.reset();
      // Garantir que a lista seja atualizada após o convite ser enviado
      setTimeout(() => onSuccess(), 500);
      
    } catch (error: any) {
      logSecureError(error, "User Invite - Submit");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro",
        description: sanitizedMessage,
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
