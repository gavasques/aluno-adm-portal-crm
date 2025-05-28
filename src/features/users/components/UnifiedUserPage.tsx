
import React from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { usePermissionGroups } from '@/hooks/admin/usePermissionGroups';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { useUserBanning } from '@/hooks/users/useUserBanning';
import { UsersHeader } from '@/components/admin/users/UsersHeader';
import { UserFilters } from '@/components/admin/users/filters/UserFilters';
import { UserTable } from './UserTable/UserTable';
import { UserDialogManager } from './UserDialogs/UserDialogManager';
import { UserBanDialog } from '@/components/admin/users/dialogs/UserBanDialog';

export const UnifiedUserPage: React.FC = () => {
  const {
    filteredUsers,
    stats,
    filters,
    isLoading,
    setFilters,
    searchUsers,
    forceRefresh
  } = usePerformanceOptimizedUserContext();

  const { permissionGroups } = usePermissionGroups();
  const { banUser, isBanning } = useUserBanning();

  const {
    type,
    user: selectedUser,
    isOpen,
    closeDialog,
    handleViewDetails,
    handleResetPassword,
    handleChangePassword,
    handleDeleteUser,
    handleSetPermissionGroup
  } = useUserDialogs();

  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [userToBan, setUserToBan] = React.useState<any>(null);

  // Calcular estatísticas de usuários banidos
  const bannedCount = React.useMemo(() => {
    const bannedGroupId = permissionGroups.find(g => g.name.toLowerCase() === "banido")?.id;
    return bannedGroupId ? filteredUsers.filter(user => user.permission_group_id === bannedGroupId).length : 0;
  }, [filteredUsers, permissionGroups]);

  const handleBanUser = (user: any) => {
    setUserToBan(user);
    setShowBanDialog(true);
  };

  const confirmBanUser = async (): Promise<boolean> => {
    if (!userToBan) return false;
    return await banUser(userToBan.id, userToBan.email);
  };

  const handleBanDialogClose = () => {
    setShowBanDialog(false);
    setUserToBan(null);
  };

  // Filtrar usuários baseado no filtro de grupo
  const displayUsers = React.useMemo(() => {
    if (filters.group === 'banned') {
      const bannedGroupId = permissionGroups.find(g => g.name.toLowerCase() === "banido")?.id;
      return bannedGroupId ? filteredUsers.filter(user => user.permission_group_id === bannedGroupId) : [];
    }
    return filteredUsers;
  }, [filteredUsers, filters.group, permissionGroups]);

  return (
    <div className="space-y-6">
      <UsersHeader />
      
      <UserFilters
        filters={filters}
        stats={stats}
        onFiltersChange={setFilters}
        onSearch={searchUsers}
        bannedCount={bannedCount}
      />

      <UserTable
        users={displayUsers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onResetPassword={handleResetPassword}
        onChangePassword={handleChangePassword}
        onDeleteUser={handleDeleteUser}
        onSetPermissionGroup={handleSetPermissionGroup}
        onBanUser={handleBanUser}
        permissionGroups={permissionGroups}
      />

      <UserDialogManager
        dialogState={{ type, user: selectedUser, isOpen }}
        onCloseDialog={closeDialog}
        onRefresh={forceRefresh}
      />

      <UserBanDialog
        open={showBanDialog}
        onOpenChange={handleBanDialogClose}
        userEmail={userToBan?.email || ''}
        onConfirmBan={confirmBanUser}
      />
    </div>
  );
};
