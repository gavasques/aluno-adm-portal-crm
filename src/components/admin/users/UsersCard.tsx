
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersList from "./UsersList";

interface UsersCardProps {
  users: any[];
  isLoading: boolean;
  searchQuery: string;
  fetchError: string | null;
  onSearchChange: (query: string) => void;
  onResetPassword: (email: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
  onRefresh?: () => void;
}

const UsersCard: React.FC<UsersCardProps> = (props) => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList {...props} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersCard;
