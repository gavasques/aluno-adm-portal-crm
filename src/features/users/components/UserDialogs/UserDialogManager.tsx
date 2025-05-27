
import React from 'react';
import { UserDialogState } from '../../hooks/useUserDialogs';
import { useUserActions } from '../../hooks/useUserActions';
import UserDetailsDialog from '@/components/admin/users/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { UserStatusDialog } from '@/components/admin/users/dialogs/UserStatusDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';

interface UserDialogManagerProps {
  dialogState: UserDialogState;
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
    confirmToggleStatus,
    confirmResetPassword,
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

  const handleConfirmToggleStatus = async (): Promise<boolean> => {
    const success = await confirmToggleStatus(user.id, user.email, user.status);
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
        open={isOpen && type === 'details'}
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

      <UserStatusDialog
        open={isOpen && type === 'status'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userEmail={user.email}
        currentStatus={user.status}
        onConfirmToggleStatus={handleConfirmToggleStatus}
      />

      <ResetPasswordDialog
        open={isOpen && type === 'reset'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userEmail={user.email}
        onConfirmReset={handleConfirmResetPassword}
      />

      <UserPermissionGroupDialog
        open={isOpen && type === 'permission'}
        onOpenChange={(open) => !open && onCloseDialog()}
        userId={user.id}
        userEmail={user.email}
        currentGroupId={user.permission_group_id || null}
        onConfirmSetPermissionGroup={handleConfirmSetPermissionGroup}
      />
    </>
  );
};
