
import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/permission.types";

// Schema for user form validation
const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string(),
  status: z.string(),
  permissionGroupId: z.number().optional().nullable().transform(v => v === undefined ? null : v)
});

interface EditUserFormProps {
  user: User;
  onSave: (data: any) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave }) => {
  const { permissionGroups } = usePermissionGroups();
  const { toast } = useToast();
  
  // Create form
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Usuário",
      status: user?.status || "Ativo",
      permissionGroupId: user?.permissionGroupId || null,
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Usuário",
        status: user.status || "Ativo",
        permissionGroupId: user.permissionGroupId || null,
      });
    }
  }, [user, form]);

  // Handle form submission
  const onSubmit = (data) => {
    // Se for um usuário comum (não Admin), o grupo de permissão é obrigatório
    if (data.role !== "Admin" && !data.permissionGroupId) {
      toast({
        title: "Erro ao salvar",
        description: "Grupo de permissão é obrigatório para usuários não administradores",
        variant: "destructive"
      });
      return;
    }
    
    onSave(data);
  };

  // Check if user is Admin (they don't need permission groups)
  const isAdmin = form.watch("role") === "Admin";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Editar Informações do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormLabel>Função*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Administrador</SelectItem>
                        <SelectItem value="Usuário">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isAdmin && (
                <FormField
                  control={form.control}
                  name="permissionGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Permissão*</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo de permissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {permissionGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditUserForm;
