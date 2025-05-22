
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import UsersList from "@/components/admin/users/UsersList";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
}

interface UsersCardProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  fetchError: string | null;
  onSearchChange: (query: string) => void;
  onResetPassword: (email: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({
  users,
  isLoading,
  searchQuery,
  fetchError,
  onSearchChange,
  onResetPassword,
  onAddUser,
  onInviteUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  return (
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
          onSearchChange={onSearchChange}
          onResetPassword={onResetPassword}
          onAddUser={onAddUser}
          onInviteUser={onInviteUser}
          onDeleteUser={onDeleteUser}
          onToggleUserStatus={onToggleUserStatus}
        />
      </CardContent>
    </Card>
  );
};

export default UsersCard;
