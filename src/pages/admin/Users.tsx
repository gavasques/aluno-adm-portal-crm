
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, RefreshCw, Loader2 } from "lucide-react";
import UsersList from "@/components/admin/users/UsersList";
import UserAddDialog from "@/components/admin/users/UserAddDialog";
import ResetPasswordDialog from "@/components/admin/users/ResetPasswordDialog";

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
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
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
      
      // Chamar a edge function list-users
      const { data, error } = await supabase.functions.invoke('list-users');
      
      if (error) {
        throw error;
      }
      
      if (data && data.users) {
        setUsers(data.users);
      } else {
        console.error("Resposta da função sem dados de usuários");
        throw new Error("Não foi possível obter a lista de usuários");
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Usuários</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Usuários</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshUsersList}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <UsersList 
            users={users}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetPassword={handleResetPassword}
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
    </div>
  );
};

export default Users;
