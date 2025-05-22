
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import UsersList from "@/components/admin/users/UsersList";
import UserAddDialog from "@/components/admin/users/UserAddDialog";
import UserInviteDialog from "@/components/admin/users/UserInviteDialog";
import ResetPasswordDialog from "@/components/admin/users/ResetPasswordDialog";
import UserDeleteDialog from "@/components/admin/users/UserDeleteDialog";
import UserStatusDialog from "@/components/admin/users/UserStatusDialog";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
}

// Dados mockados para usar quando a API falhar
const mockUsers: User[] = [
  {
    id: "mock-1",
    name: "Administrador",
    email: "admin@exemplo.com",
    role: "Admin",
    status: "Ativo",
    lastLogin: "Nunca",
    tasks: [],
  },
  {
    id: "mock-2",
    name: "Aluno Exemplo",
    email: "aluno@exemplo.com",
    role: "Student",
    status: "Ativo",
    lastLogin: "Nunca",
    tasks: [],
  }
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserStatus, setSelectedUserStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Buscar usuários da Edge Function ou usar dados mockados em caso de falha
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar os usuários via Edge Function
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      
      // Tentar obter usuários do Supabase Auth diretamente se a edge function falhar
      try {
        // Chamar a edge function list-users com GET (sem body)
        const { data, error } = await supabase.functions.invoke('list-users', {
          method: 'GET'
        });
        
        if (error) {
          console.error("Erro ao chamar a função list-users:", error);
          throw error;
        }
        
        if (data && data.users) {
          console.log("Dados recebidos:", data.users.length, "usuários");
          setUsers(data.users);
        } else {
          console.error("Resposta da função sem dados de usuários:", data);
          throw new Error("A resposta do servidor não contém dados de usuários válidos");
        }
      } catch (edgeFunctionError) {
        console.error("Erro ao chamar edge function:", edgeFunctionError);
        
        // Obter usuários diretamente da API de autenticação
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.error("Erro ao listar usuários via API direta:", authError);
            throw authError;
          }
          
          if (authData && authData.users) {
            // Mapear usuários para o formato esperado
            const formattedUsers = authData.users.map(user => ({
              id: user.id,
              name: user.user_metadata?.name || "Usuário sem nome",
              email: user.email || "",
              role: user.user_metadata?.role || "Student",
              status: user.banned ? "Inativo" : (user.user_metadata?.status === "Convidado" ? "Convidado" : "Ativo"),
              lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
              tasks: []
            }));
            
            setUsers(formattedUsers);
          } else {
            // Se ambas as abordagens falharem, usar dados mockados
            setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
            setUsers(mockUsers);
          }
        } catch (authError) {
          console.error("Erro ao obter usuários via API direta:", authError);
          setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
          setUsers(mockUsers);
        }
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
      setUsers(mockUsers);
      toast({
        title: "Erro",
        description: "Não foi possível obter a lista de usuários. Exibindo dados de exemplo.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Função para atualizar a lista de usuários
  const refreshUsersList = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  // Função para lidar com a redefinição de senha
  const handleResetPassword = (email: string) => {
    setSelectedUserEmail(email);
    setShowResetDialog(true);
  };

  // Função para abrir o diálogo de adicionar usuário
  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  // Função para abrir o diálogo de convidar usuário
  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  // Função para abrir o diálogo de excluir usuário
  const handleDeleteUser = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setShowDeleteDialog(true);
  };

  // Função para abrir o diálogo de alteração de status do usuário
  const handleToggleUserStatus = (userId: string, email: string, isActive: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserStatus(isActive);
    setShowStatusDialog(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Usuários</h1>
        <Button onClick={refreshUsersList} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {fetchError && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Usuários</CardTitle>
            {fetchError && (
              <CardDescription className="text-orange-500">
                Exibindo dados de exemplo. Use o botão Atualizar para tentar novamente.
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <UsersList 
            users={users}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetPassword={handleResetPassword}
            onAddUser={handleAddUser}
            onInviteUser={handleInviteUser}
            onDeleteUser={handleDeleteUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        </CardContent>
      </Card>

      {/* Dialog components */}
      <UserAddDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={refreshUsersList}
      />

      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={refreshUsersList}
      />

      <ResetPasswordDialog 
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={selectedUserEmail}
      />

      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        onSuccess={refreshUsersList}
      />

      <UserStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        isActive={selectedUserStatus}
        onSuccess={refreshUsersList}
      />
    </div>
  );
};

export default Users;
