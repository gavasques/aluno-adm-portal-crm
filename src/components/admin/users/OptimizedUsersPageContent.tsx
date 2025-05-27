import React from "react";
import { useUsers } from "@/hooks/users/useUsers";
import { useSimplifiedUserOperations } from "@/hooks/users/useSimplifiedUserOperations";
import { useUserDropdownActions } from "@/hooks/users/useUserDropdownActions";
import UsersHeader from "./UsersHeader";
import UsersAlert from "./UsersAlert";
import { UserFilters } from "./filters/UserFilters";
import UserActionButtons from "./UserActionButtons";
import { OptimizedUserTable } from "./table/OptimizedUserTable";
import { ValidatedUserDialogs } from "./dialogs/ValidatedUserDialogs";

export const OptimizedUsersPageContent: React.FC = () => {
  const {
    filteredUsers,
    stats,
    filters,
    isLoading,
    isRefreshing,
    error,
    setFilters,
    searchUsers,
    refreshUsers
  } = useUsers();

  const {
    showAddDialog,
    setShowAddDialog,
    showInviteDialog,
    setShowInviteDialog,
    handleAddUser,
    handleInviteUser,
  } = useSimplifiedUserOperations();

  // Placeholder handlers for table actions (will be implemented in future phases)
  const adaptedHandlers = {
    onViewDetails: (user: any) => console.log('View details:', user),
    onResetPassword: (user: any) => console.log('Reset password:', user),
    onDeleteUser: (user: any) => console.log('Delete user:', user),
    onToggleUserStatus: (user: any) => console.log('Toggle status:', user),
    onSetPermissionGroup: (user: any) => console.log('Set permissions:', user),
  };

  return (
    <div className="space-y-6">
      <UsersHeader 
        refreshUsersList={refreshUsers} 
        isRefreshing={isRefreshing} 
      />

      <UsersAlert fetchError={error} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <UserFilters
              filters={filters}
              stats={stats}
              onFiltersChange={setFilters}
              onSearch={searchUsers}
            />
          </div>
          <UserActionButtons onAddUser={handleAddUser} onInviteUser={handleInviteUser} />
        </div>

        <OptimizedUserTable
          users={filteredUsers}
          isLoading={isLoading}
          {...adaptedHandlers}
        />
      </div>

      <ValidatedUserDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showInviteDialog={showInviteDialog}
        setShowInviteDialog={setShowInviteDialog}
        onRefresh={refreshUsers}
      />
    </div>
  );
};
