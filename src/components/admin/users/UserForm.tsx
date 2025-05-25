
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
import { useAdminOperations } from "@/hooks/auth/useBasicAuth/useAdminOperations";
import { userFormSchema } from "@/utils/validation-schemas";
import { validatePassword } from "@/utils/security";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { createAdminUser } = useAdminOperations();

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

      console.log("Enviando dados do formulário:", {
        ...data,
        password: "***"
      });

      // Criar usuário com todos os dados incluindo is_mentor
      const result = await createAdminUser(
        data.email, 
        data.name, 
        data.role, 
        data.password,
        data.is_mentor
      );
      
      // Se a operação foi bem-sucedida ou o usuário foi sincronizado
      if (result && (result.success || result.existed)) {
        console.log("Usuário criado/sincronizado com sucesso:", result);
        
        // Mostrar estado de sucesso
        setIsSuccess(true);
        
        // Toast de sucesso personalizado com duração estendida
        toast({
          title: "✅ Operação Concluída",
          description: result.existed && result.profileCreated 
            ? "Usuário já existia, mas foi sincronizado com sucesso!"
            : "Usuário criado com sucesso!",
          duration: 4000, // 4 segundos
        });

        // Reset do formulário
        form.reset();
        setPasswordErrors([]);
        
        // Delay para mostrar o feedback antes de fechar
        setTimeout(() => {
          onSuccess();
        }, 4000); // 4 segundos para ver o feedback completo
      }
    } catch (error) {
      console.error("Erro no formulário:", error);
      // O erro já foi sanitizado e exibido no hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se está em estado de sucesso, mostrar feedback visual
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="relative">
          <CheckCircle className="h-16 w-16 text-green-500 animate-scale-in" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-green-500 rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-green-700">Usuário Criado!</h3>
          <p className="text-sm text-gray-600">
            A operação foi concluída com sucesso.
          </p>
          <p className="text-xs text-gray-500">
            Esta janela será fechada automaticamente...
          </p>
        </div>
      </div>
    );
  }

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
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || passwordErrors.length > 0}
            className="relative"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Criando...
              </>
            ) : (
              "Adicionar Usuário"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
