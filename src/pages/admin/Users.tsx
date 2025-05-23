
import React, { useState } from "react";
import { useUsersList } from "@/hooks/admin/useUsersList";
import { useUserDialogs } from "@/hooks/admin/useUserDialogs";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersAlert from "@/components/admin/users/UsersAlert";
import UsersCard from "@/components/admin/users/UsersCard";
import UsersDialogs from "@/components/admin/users/UsersDialogs";
import PendingUsersCard from "@/components/admin/users/PendingUsersCard";

const Users = () => {
  const { users, isLoading, isRefreshing, fetchError, refreshUsersList } = useUsersList();
  const [searchQuery, setSearchQuery] = useState("");
  const dialogsState = useUserDialogs();

  // Contar usuários pendentes
  const pendingUsers = users.filter(user => 
    user.permission_group_id && user.role !== "Admin"
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <UsersHeader 
        refreshUsersList={refreshUsersList} 
        isRefreshing={isRefreshing} 
      />

      <UsersAlert fetchError={fetchError} />

      {/* Card de usuários pendentes - mostrar apenas se houver usuários pendentes */}
      {pendingUsers.length > 0 && (
        <PendingUsersCard
          users={users}
          isLoading={isLoading}
          onAssignGroup={dialogsState.handleSetPermissionGroup}
        />
      )}

      <UsersCard
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        fetchError={fetchError}
        onSearchChange={setSearchQuery}
        onResetPassword={dialogsState.handleResetPassword}
        onAddUser={dialogsState.handleAddUser}
        onInviteUser={dialogsState.handleInviteUser}
        onDeleteUser={dialogsState.handleDeleteUser}
        onToggleUserStatus={dialogsState.handleToggleUserStatus}
        onSetPermissionGroup={dialogsState.handleSetPermissionGroup}
      />

      <UsersDialogs
        showAddDialog={dialogsState.showAddDialog}
        setShowAddDialog={dialogsState.setShowAddDialog}
        showInviteDialog={dialogsState.showInviteDialog}
        setShowInviteDialog={dialogsState.setShowInviteDialog}
        showDeleteDialog={dialogsState.showDeleteDialog}
        setShowDeleteDialog={dialogsState.setShowDeleteDialog}
        showStatusDialog={dialogsState.showStatusDialog}
        setShowStatusDialog={dialogsState.setShowStatusDialog}
        showResetDialog={dialogsState.showResetDialog}
        setShowResetDialog={dialogsState.setShowResetDialog}
        showPermissionDialog={dialogsState.showPermissionDialog}
        setShowPermissionDialog={dialogsState.setShowPermissionDialog}
        selectedUserEmail={dialogsState.selectedUserEmail}
        selectedUserId={dialogsState.selectedUserId}
        selectedUserStatus={dialogsState.selectedUserStatus}
        selectedUserPermissionGroupId={dialogsState.selectedUserPermissionGroupId}
        onSuccess={refreshUsersList}
      />
    </div>
  );
};

export default Users;
