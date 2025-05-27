
import React from "react";
import { UserTable } from "./table/UserTable";
import { User } from "@/types/user.types";

interface UsersListProps {
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
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
  onRefresh?: () => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  isLoading,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup,
}) => {
  const handleViewDetails = (user: User) => {
    // This will be handled by the parent component
    console.log("View details for user:", user.email);
  };

  return (
    <UserTable
      users={users}
      isLoading={isLoading}
      onViewDetails={handleViewDetails}
      onResetPassword={onResetPassword}
      onDeleteUser={onDeleteUser}
      onToggleUserStatus={onToggleUserStatus}
      onSetPermissionGroup={onSetPermissionGroup}
    />
  );
};

export default UsersList;
