
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Loader2 } from "lucide-react";
import UsersList from "@/components/admin/users/UsersList";
import UserAddDialog from "@/components/admin/users/UserAddDialog";
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

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserStatus, setSelectedUserStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Buscar usuários da Edge Function
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar os usuários via Edge Function
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Chamar a edge function list-users com GET (sem body)
      const { data, error } = await supabase.functions.invoke('list-users', {
        method: 'GET'
      });
      
      if (error) {
        console.error("Erro ao chamar a função list-users:", error);
        toast({
          title: "Erro ao buscar usuários",
          description: error.message || "Não foi possível obter a lista de usuários",
          variant: "destructive",
        });
        throw error;
      }
      
      if (data && data.users) {
        console.log("Dados recebidos:", data.users.length, "usuários");
        setUsers(data.users);
      } else {
        console.error("Resposta da função sem dados de usuários:", data);
        toast({
          title: "Dados incompletos",
          description: "A resposta do servidor não contém dados de usuários válidos",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter a lista de usuários. Verifique o console para mais detalhes.",
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
        <Button onClick={handleAddUser}>
          <RefreshCw className="mr-2 h-4 w-4" onClick={(e) => {
            e.stopPropagation();
            refreshUsersList();
          }} />
          {isRefreshing ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList 
            users={users}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetPassword={handleResetPassword}
            onAddUser={handleAddUser}
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
