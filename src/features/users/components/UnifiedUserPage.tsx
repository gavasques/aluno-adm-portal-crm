
import React from "react";
import { useUsers } from "@/hooks/users/useUsers";
import { useSimplifiedUserOperations } from "@/hooks/users/useSimplifiedUserOperations";
import { useUserDialogs } from "../hooks/useUserDialogs";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersAlert from "@/components/admin/users/UsersAlert";
import { UserFilters } from "@/components/admin/users/filters/UserFilters";
import UserActionButtons from "@/components/admin/users/UserActionButtons";
import { UserTable } from "./UserTable/UserTable";
import { ValidatedUserDialogs } from "@/components/admin/users/dialogs/ValidatedUserDialogs";
import { UserDialogManager } from "./UserDialogs/UserDialogManager";
import { FunctionalityChecklist } from "@/components/admin/users/FunctionalityChecklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UnifiedUserPage: React.FC = () => {
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

  const {
    type,
    user,
    isOpen,
    closeDialog,
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSetPermissionGroup
  } = useUserDialogs();

  console.log('🔧 UnifiedUserPage: Rendering with dialog state:', { type, isOpen, userEmail: user?.email });

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
        <TabsTrigger value="checklist">Checklist de Testes</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6">
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

          <UserTable
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

        <UserDialogManager
          dialogState={{ type, user, isOpen }}
          onCloseDialog={closeDialog}
          onRefresh={refreshUsers}
        />
      </TabsContent>

      <TabsContent value="checklist">
        <FunctionalityChecklist />
      </TabsContent>
    </Tabs>
  );
};
