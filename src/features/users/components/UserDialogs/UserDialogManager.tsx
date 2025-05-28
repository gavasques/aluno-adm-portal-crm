
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import { UserDetailsDialog } from '@/components/admin/users/dialogs/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import UserStorageManagementDialog from '@/components/admin/users/dialogs/UserStorageManagementDialog';
import UserActivityLogsDialog from '@/components/admin/users/dialogs/UserActivityLogsDialog';

interface UserDialogManagerProps {
  dialogState: DialogState;
  onCloseDialog: () => void;
  onRefresh?: () => void;
}

export const UserDialogManager: React.FC<UserDialogManagerProps> = ({
  dialogState,
  onCloseDialog,
  onRefresh
}) => {
  const { type, user, isOpen } = dialogState;

  return (
    <>
      <UserDetailsDialog
        open={isOpen && type === 'view'}
        onOpenChange={onCloseDialog}
        user={user}
        onRefresh={onRefresh}
      />

      <UserDeleteDialog
        open={isOpen && type === 'delete'}
        onOpenChange={onCloseDialog}
        user={user}
        onRefresh={onRefresh}
      />

      <ResetPasswordDialog
        open={isOpen && type === 'reset'}
        onOpenChange={onCloseDialog}
        user={user}
      />

      <ChangePasswordDialog
        open={isOpen && type === 'changePassword'}
        onOpenChange={onCloseDialog}
        user={user}
      />

      <UserPermissionGroupDialog
        open={isOpen && type === 'permissions'}
        onOpenChange={onCloseDialog}
        user={user}
        onRefresh={onRefresh}
      />

      <UserStorageManagementDialog
        open={isOpen && type === 'storage'}
        onOpenChange={onCloseDialog}
        user={user}
      />

      <UserActivityLogsDialog
        open={isOpen && type === 'activity'}
        onOpenChange={onCloseDialog}
        user={user}
      />
    </>
  );
};
