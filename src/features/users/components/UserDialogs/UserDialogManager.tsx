
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import { useUserActions } from '../../hooks/useUserActions';
import UserDetailsDialog from '@/components/admin/users/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import UserStorageManagementDialog from '@/components/admin/users/dialogs/UserStorageManagementDialog';

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
  const {
    confirmDelete,
    confirmResetPassword,
    confirmChangePassword,
    confirmSetPermissionGroup
  } = useUserActions();

  const { type, user, isOpen } = dialogState;

  if (!user) return null;

  console.log('🔧 UserDialogManager: Rendering dialog type:', type, 'for user:', user.email);

  const handleConfirmDelete = async (): Promise<boolean> => {
    const success = await confirmDelete(user.id, user.email);
    if (success) {
      onCloseDialog();
      onRefresh?.();
    }
    return success;
  };

  const handleConfirmResetPassword = async (): Promise<boolean> => {
    const success = await confirmResetPassword(user.email);
    if (success) {
      onCloseDialog();
    }
    return success;
  };

  const handleConfirmChangePassword = async (newPassword: string): Promise<boolean> => {
    const success = await confirmChangePassword(user.id, newPassword);
    if (success) {
      onCloseDialog();
    }
    return success;
  };

  const handleConfirmSetPermissionGroup = async (groupId: string | null): Promise<boolean> => {
    const success = await confirmSetPermissionGroup(user.id, user.email, groupId);
    if (success) {
      onCloseDialog();
      onRefresh?.();
    }
    return success;
  };

  return (
    <>
      <UserDetailsDialog
        open={isOpen && type === 'view'}
        onOpenChange={(open) => !open && onCloseDialog()}
        user={user}
        onRefresh={onRefresh}
      />

      <UserDeleteDialog
        open={isOpen && type === 'delete'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userEmail={user.email}
        onConfirmDelete={handleConfirmDelete}
      />

      <ResetPasswordDialog
        open={isOpen && type === 'reset'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userEmail={user.email}
        onConfirmReset={handleConfirmResetPassword}
      />

      <ChangePasswordDialog
        open={isOpen && type === 'changePassword'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userEmail={user.email}
        onConfirmChange={handleConfirmChangePassword}
      />

      <UserPermissionGroupDialog
        open={isOpen && type === 'permissions'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userId={user.id}
        userEmail={user.email}
        currentGroupId={user.permission_group_id || null}
        onConfirmSetPermissionGroup={handleConfirmSetPermissionGroup}
      />

      <UserStorageManagementDialog
        open={isOpen && type === 'storage'}
        onOpenChange={(open) => !open && onCloseDialog()}
        user={user}
      />
    </>
  );
};
