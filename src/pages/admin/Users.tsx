
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  AlertTriangle,
  Mail,
  KeyRound,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string({ required_error: "Selecione um papel" }),
});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
}

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Buscar usuários do Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar os usuários do Supabase
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Buscar usuários da tabela auth.users (requer função administradora)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Buscar perfis dos usuários da tabela profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Mapear usuários autenticados para o formato esperado pela interface
      const mappedUsers: User[] = authUsers.users.map(authUser => {
        // Encontrar o perfil correspondente ao usuário
        const profile = profiles?.find(p => p.id === authUser.id);
        
        return {
          id: authUser.id,
          name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
          email: authUser.email || '',
          role: profile?.role || 'Student',
          status: authUser.banned ? 'Inativo' : 'Ativo',
          lastLogin: authUser.last_sign_in_at 
            ? new Date(authUser.last_sign_in_at).toLocaleDateString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) 
            : 'Nunca',
          tasks: []
        };
      });

      // Verificar e criar perfis para usuários que não têm um
      for (const authUser of authUsers.users) {
        const hasProfile = profiles?.some(p => p.id === authUser.id);
        
        if (!hasProfile) {
          // Criar um perfil para este usuário
          await supabase.from('profiles').insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
            role: authUser.email?.includes('gavasques') ? 'Admin' : 'Student' // Define gavasques como Admin
          });
          console.log(`Perfil criado para o usuário ${authUser.email}`);
        }
      }
      
      // Ordenar usuários por email
      mappedUsers.sort((a, b) => a.email.localeCompare(b.email));
      
      setUsers(mappedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Filtrar usuários de acordo com a pesquisa
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formulário para adicionar usuário
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
    },
  });

  // Resetar senha de um usuário
  const handleResetPassword = async (email) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Link de redefinição de senha enviado",
        description: `Um email foi enviado para ${email} com instruções para redefinição de senha.`,
      });
      
      setShowResetDialog(false);
    } catch (error) {
      console.error("Erro ao enviar email de redefinição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adicionar um novo usuário
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Gerar uma senha aleatória temporária
      const tempPassword = Math.random().toString(36).slice(-8);

      // Criar um novo usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: data.name,
          role: data.role,
        }
      });

      if (authError) throw authError;

      // Criar um perfil para o novo usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
        });

      if (profileError) throw profileError;
      
      // Enviar email de redefinição de senha
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) throw resetError;
      
      toast({
        title: "Usuário adicionado com sucesso",
        description: `Um email de definição de senha foi enviado para ${data.email}.`,
      });
      
      setShowAddDialog(false);
      form.reset();
      
      // Atualizar a lista de usuários
      fetchUsers();
      
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Usuários</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Carregando usuários...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "Admin" ? "default" : "outline"}
                          className={
                            user.role === "Admin"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "Ativo" ? "default" : "outline"}
                          className={
                            user.status === "Ativo"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedUserEmail(user.email);
                              setShowResetDialog(true);
                            }}>
                              <KeyRound className="mr-2 h-4 w-4" /> Redefinir senha
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Função não implementada",
                                description: "Esta funcionalidade será implementada em breve.",
                              });
                            }}>
                              Ver detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para adicionar usuário */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo usuário ao sistema. Um email de definição de senha será enviado automaticamente.
            </DialogDescription>
          </DialogHeader>
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
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adicionando..." : "Adicionar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para redefinir senha */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" /> 
              Enviar Email de Redefinição de Senha
            </DialogTitle>
            <DialogDescription>
              Um email de redefinição de senha será enviado para o usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 border-y">
            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="text-amber-600 h-5 w-5" />
              <p className="text-sm text-amber-800">
                Tem certeza que deseja enviar um email de redefinição de senha para <strong>{selectedUserEmail}</strong>?
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleResetPassword(selectedUserEmail)} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
