
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/auth";
import { userFormSchema } from "@/utils/validation-schemas";
import { validatePassword } from "@/utils/security";

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { createAdminUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      password: "",
      is_mentor: false,
    },
  });

  // Validação em tempo real da senha
  const handlePasswordChange = (password: string) => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    return password;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Validação final da senha
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        return;
      }

      const result = await createAdminUser(
        data.email, 
        data.name, 
        data.role, 
        data.password,
        data.is_mentor
      );
      
      form.reset();
      setPasswordErrors([]);
      
      // Só atualiza a lista e fecha o diálogo se realmente foi criado um novo usuário
      if (result && !result.existed) {
        setTimeout(() => onSuccess(), 500);
      }
    } catch (error) {
      // O erro já foi sanitizado e exibido no hook
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
              <FormLabel>Senha*</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Senha segura (obrigatória)" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(handlePasswordChange(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
              {passwordErrors.length > 0 && (
                <div className="text-sm text-red-600 mt-2">
                  <p className="font-medium">Critérios de senha:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_mentor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">É Mentor</FormLabel>
                <div className="text-sm text-gray-500">
                  Permitir que este usuário seja selecionado como mentor nas mentorias
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
          <Button type="submit" disabled={isSubmitting || passwordErrors.length > 0}>
            {isSubmitting ? "Adicionando..." : "Adicionar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
