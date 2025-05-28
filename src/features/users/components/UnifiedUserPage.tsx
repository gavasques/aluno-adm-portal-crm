
import React from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { UserTable } from './UserTable/UserTable';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { UserDialogManager } from './UserDialogs/UserDialogManager';

const UnifiedUserPage: React.FC = () => {
  const {
    filteredUsers,
    isLoading,
    refreshUsers,
    permissionGroups
  } = usePerformanceOptimizedUserContext();

  const { dialogState, openDialog, closeDialog } = useUserDialogs();

  return (
    <div className="space-y-6">
      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onViewDetails={(user) => openDialog('view', user)}
        onResetPassword={(user) => openDialog('reset', user)}
        onChangePassword={(user) => openDialog('changePassword', user)}
        onDeleteUser={(user) => openDialog('delete', user)}
        onSetPermissionGroup={(user) => openDialog('permissions', user)}
        onStorageManagement={(user) => openDialog('storage', user)}
        onActivityLogs={(user) => openDialog('activity', user)}
        onSendMagicLink={(user) => openDialog('sendMagicLink', user)}
        onToggleMentor={(user) => openDialog('mentor', user)}
        permissionGroups={permissionGroups}
      />

      <UserDialogManager
        dialogState={dialogState}
        onCloseDialog={closeDialog}
        onRefresh={refreshUsers}
      />
    </div>
  );
};

export default UnifiedUserPage;
