
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
import UserDetailsDialog from "./UserDetailsDialog";
import { UserDeleteDialog } from "./dialogs/UserDeleteDialog";
import { UserStatusDialog } from "./dialogs/UserStatusDialog";
import { ResetPasswordDialog } from "./dialogs/ResetPasswordDialog";
import { UserPermissionGroupDialog } from "./dialogs/UserPermissionGroupDialog";

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

  // Usar os handlers do useUserDropdownActions
  const {
    selectedUser,
    showDetailsDialog,
    showDeleteDialog,
    showStatusDialog,
    showResetDialog,
    showPermissionDialog,
    setShowDetailsDialog,
    setShowDeleteDialog,
    setShowStatusDialog,
    setShowResetDialog,
    setShowPermissionDialog,
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSetPermissionGroup,
    confirmDelete,
    confirmToggleStatus,
    confirmResetPassword,
    confirmSetPermissionGroup
  } = useUserDropdownActions();

  console.log('🔧 OptimizedUsersPageContent - Estados dos diálogos:', {
    selectedUser: selectedUser?.email,
    showDetailsDialog,
    showDeleteDialog,
    showStatusDialog,
    showResetDialog,
    showPermissionDialog
  });

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
          onViewDetails={handleViewDetails}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
          onToggleUserStatus={handleToggleUserStatus}
          onSetPermissionGroup={handleSetPermissionGroup}
        />
      </div>

      <ValidatedUserDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showInviteDialog={showInviteDialog}
        setShowInviteDialog={setShowInviteDialog}
        onRefresh={refreshUsers}
      />

      {/* Diálogos controlados diretamente pelos estados do useUserDropdownActions */}
      {selectedUser && (
        <>
          <UserDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            user={selectedUser}
          />

          <UserDeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            userEmail={selectedUser.email}
            onConfirmDelete={confirmDelete}
          />

          <UserStatusDialog
            open={showStatusDialog}
            onOpenChange={setShowStatusDialog}
            userEmail={selectedUser.email}
            currentStatus={selectedUser.status}
            onConfirmToggleStatus={confirmToggleStatus}
          />

          <ResetPasswordDialog
            open={showResetDialog}
            onOpenChange={setShowResetDialog}
            userEmail={selectedUser.email}
            onConfirmReset={confirmResetPassword}
          />

          <UserPermissionGroupDialog
            open={showPermissionDialog}
            onOpenChange={setShowPermissionDialog}
            userId={selectedUser.id}
            userEmail={selectedUser.email}
            currentGroupId={selectedUser.permission_group_id || null}
            onConfirmSetPermissionGroup={confirmSetPermissionGroup}
          />
        </>
      )}
    </div>
  );
};
