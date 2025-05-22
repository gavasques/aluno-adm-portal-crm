
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
    <div className="container mx-auto py-6">
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
      />

      <UsersDialogs
        {...dialogsState}
        onSuccess={refreshUsersList}
      />
    </div>
  );
};

export default Users;
