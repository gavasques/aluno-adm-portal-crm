
import React from "react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { validatePassword } from "@/utils/security";
import { type CreateUserInput } from "@/schemas/user.schemas";
import { UseFormReturn } from "react-hook-form";

interface ValidatedUserFormProps {
  form: UseFormReturn<CreateUserInput>;
  onSubmit: (data: CreateUserInput) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ValidatedUserForm: React.FC<ValidatedUserFormProps> = ({ 
  form, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const watchedPassword = form.watch("password");
  const passwordValidation = validatePassword(watchedPassword || "");

  const handleSubmit = async (data: CreateUserInput) => {
    const success = await onSubmit(data);
    // O form será resetado automaticamente no hook se success for true
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome completo" 
                  {...field}
                  disabled={isSubmitting}
                />
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
                <Input 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  {...field}
                  disabled={isSubmitting}
                />
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Student">Aluno</SelectItem>
                  <SelectItem value="Mentor">Mentor</SelectItem>
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
                  placeholder="Senha segura" 
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
              
              {/* Indicador visual da força da senha */}
              {watchedPassword && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {passwordValidation.isValid ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Senha válida
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Senha inválida
                      </Badge>
                    )}
                  </div>
                  
                  {!passwordValidation.isValid && passwordValidation.errors.length > 0 && (
                    <div className="text-sm text-red-600">
                      <p className="font-medium">Critérios necessários:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordValidation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                <FormDescription>
                  Permitir que este usuário seja selecionado como mentor nas mentorias
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
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
            disabled={isSubmitting || !passwordValidation.isValid}
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
