
import React from "react";
import { useUsers } from "@/hooks/users/useUsers";
import { useUserOperations } from "@/hooks/users/useUserOperations";
import { useUserDropdownActions } from "@/hooks/users/useUserDropdownActions";
import UsersHeader from "./UsersHeader";
import UsersAlert from "./UsersAlert";
import { UserFilters } from "./filters/UserFilters";
import UserActionButtons from "./UserActionButtons";
import { OptimizedUserTable } from "./table/OptimizedUserTable";
import { UserDialogs } from "./dialogs/UserDialogs";

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
    // Dialog states
    showAddDialog,
    setShowAddDialog,
    showInviteDialog,
    setShowInviteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showStatusDialog,
    setShowStatusDialog,
    showResetDialog,
    setShowResetDialog,
    showPermissionDialog,
    setShowPermissionDialog,
    showDetailsDialog,
    setShowDetailsDialog,

    // Selected user data
    selectedUserId,
    selectedUserEmail,
    selectedUserStatus,
    selectedUserPermissionGroupId,
    selectedUser,

    // Handlers
    handleAddUser,
    handleInviteUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleResetPassword,
    handleSetPermissionGroup,
    handleViewDetails,

    // Confirmation actions
    confirmDelete,
    confirmToggleStatus,
    confirmResetPassword,
    confirmSetPermissionGroup,

    // Operations
    createUser,
  } = useUserOperations();

  const {
    handleViewDetails: handleUserView,
    handleResetPassword: handleUserReset,
    handleDeleteUser: handleUserDelete,
    handleToggleStatus: handleUserToggle,
    handleSetPermissions: handleUserPermissions,
  } = useUserDropdownActions();

  // Adapter functions to bridge the gap between different handler signatures
  const adaptedHandlers = {
    onViewDetails: handleViewDetails,
    onResetPassword: (user: any) => handleResetPassword(user.email),
    onDeleteUser: (user: any) => handleDeleteUser(user.id, user.email),
    onToggleUserStatus: (user: any) => handleToggleUserStatus(user.id, user.email, user.status === 'Ativo'),
    onSetPermissionGroup: (user: any) => handleSetPermissionGroup?.(user.id, user.email, user.permission_group_id),
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

      <UserDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showInviteDialog={showInviteDialog}
        setShowInviteDialog={setShowInviteDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        showStatusDialog={showStatusDialog}
        setShowStatusDialog={setShowStatusDialog}
        showResetDialog={showResetDialog}
        setShowResetDialog={setShowResetDialog}
        showPermissionDialog={showPermissionDialog}
        setShowPermissionDialog={setShowPermissionDialog}
        showDetailsDialog={showDetailsDialog}
        setShowDetailsDialog={setShowDetailsDialog}
        selectedUserEmail={selectedUserEmail}
        selectedUserId={selectedUserId}
        selectedUserStatus={selectedUserStatus}
        selectedUserPermissionGroupId={selectedUserPermissionGroupId}
        selectedUser={selectedUser}
        onCreateUser={createUser}
        onConfirmDelete={confirmDelete}
        onConfirmToggleStatus={confirmToggleStatus}
        onConfirmResetPassword={confirmResetPassword}
        onConfirmSetPermissionGroup={confirmSetPermissionGroup}
        onRefresh={refreshUsers}
      />
    </div>
  );
};
