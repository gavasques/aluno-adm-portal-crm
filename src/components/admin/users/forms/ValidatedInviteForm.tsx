
import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { type InviteUserInput } from "@/schemas/user.schemas";
import { UseFormReturn } from "react-hook-form";

interface ValidatedInviteFormProps {
  form: UseFormReturn<InviteUserInput>;
  onSubmit: (data: InviteUserInput) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ValidatedInviteForm: React.FC<ValidatedInviteFormProps> = ({ 
  form, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const handleSubmit = async (data: InviteUserInput) => {
    const success = await onSubmit(data);
    // O form será resetado automaticamente no hook se success for true
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Mail className="w-4 h-4 text-blue-600" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Convite por Email</p>
            <p>Um email de convite será enviado automaticamente</p>
          </div>
        </div>

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

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Info
            </Badge>
            <div className="text-sm text-amber-700">
              <p className="font-medium">Como funciona o convite:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>O usuário será criado no sistema</li>
                <li>Um email de redefinição de senha será enviado</li>
                <li>O usuário definirá sua própria senha no primeiro acesso</li>
              </ul>
            </div>
          </div>
        </div>

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
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Convite
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
