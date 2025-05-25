
import React, { useState } from "react";
import { useUsersList } from "@/hooks/admin/useUsersList";
import { useUserDialogs } from "@/hooks/admin/useUserDialogs";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersAlert from "@/components/admin/users/UsersAlert";
import UsersCard from "@/components/admin/users/UsersCard";
import UsersDialogs from "@/components/admin/users/UsersDialogs";

const Users = () => {
  const { users, isLoading, isRefreshing, fetchError, refreshUsersList } = useUsersList();
  const [searchQuery, setSearchQuery] = useState("");
  const dialogsState = useUserDialogs();

  return (
    <div className="w-full space-y-6">
      <UsersHeader 
        refreshUsersList={refreshUsersList} 
        isRefreshing={isRefreshing} 
      />

      <UsersAlert fetchError={fetchError} />

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
        onRefresh={refreshUsersList}
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
