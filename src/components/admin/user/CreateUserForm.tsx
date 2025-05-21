
import React from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { UserPlus } from "lucide-react";

// Schema para validação do formulário de usuário
const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.string(),
  status: z.string(),
  permissionGroupId: z.number().optional().nullable().transform(v => v === undefined ? null : v)
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface CreateUserFormProps {
  open: boolean;
  onClose: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ open, onClose }) => {
  const { permissionGroups } = usePermissionGroups();
  const { toast } = useToast();
  const { createUser, loading } = useUserManagement();
  
  // Criar formulário
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Usuário",
      status: "Ativo",
      permissionGroupId: null,
    },
  });

  // Lidar com a submissão do formulário
  const onSubmit = async (data: UserFormValues) => {
    // Se for um usuário comum (não Admin), o grupo de permissão é obrigatório
    if (data.role !== "Admin" && !data.permissionGroupId) {
      toast({
        title: "Erro ao salvar",
        description: "Grupo de permissão é obrigatório para usuários não administradores",
        variant: "destructive"
      });
      return;
    }
    
    // Garantir que todos os campos obrigatórios tenham valores definidos
    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      status: data.status,
      permissionGroupId: data.permissionGroupId
    };
    
    const success = await createUser(userData);
    if (success) {
      form.reset();
      onClose();
    }
  };

  // Verificar se o usuário é Admin (eles não precisam de grupos de permissão)
  const isAdmin = form.watch("role") === "Admin";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Criar Novo Usuário
          </DialogTitle>
        </DialogHeader>
        
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha*</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
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
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
