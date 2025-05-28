
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { UserDetailsDialog } from '@/components/admin/users/dialogs/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import { SendMagicLinkDialog } from '@/components/admin/users/dialogs/SendMagicLinkDialog';
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
  const { 
    deleteUser, 
    resetPassword, 
    setPermissionGroup 
  } = usePerformanceOptimizedUserContext();

  const { type, user, isOpen } = dialogState;

  if (!user) return null;

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
        userEmail={user.email}
        onConfirmDelete={async () => {
          try {
            const success = await deleteUser(user.id, user.email);
            if (success && onRefresh) {
              onRefresh();
            }
            return success;
          } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return false;
          }
        }}
      />

      <ResetPasswordDialog
        open={isOpen && type === 'reset'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmReset={async () => {
          try {
            const success = await resetPassword(user.email);
            return success;
          } catch (error) {
            console.error('Erro ao resetar senha:', error);
            return false;
          }
        }}
      />

      <ChangePasswordDialog
        open={isOpen && type === 'changePassword'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmChange={async (newPassword: string) => {
          try {
            // TODO: Implementar função específica para alterar senha de usuário
            console.log('Alterar senha para:', user.email, 'Nova senha:', newPassword);
            return true;
          } catch (error) {
            console.error('Erro ao alterar senha:', error);
            return false;
          }
        }}
      />

      <SendMagicLinkDialog
        open={isOpen && type === 'sendMagicLink'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmSend={async () => {
          try {
            // TODO: Implementar envio de magic link
            console.log('Enviar Magic Link para:', user.email);
            return true;
          } catch (error) {
            console.error('Erro ao enviar Magic Link:', error);
            return false;
          }
        }}
      />

      <UserPermissionGroupDialog
        open={isOpen && type === 'permissions'}
        onOpenChange={onCloseDialog}
        userId={user.id}
        userEmail={user.email}
        currentGroupId={user.permission_group_id || null}
        onConfirmSetPermissionGroup={async (groupId: string | null) => {
          try {
            const success = await setPermissionGroup(user.id, user.email, groupId);
            if (success && onRefresh) {
              onRefresh();
            }
            return success;
          } catch (error) {
            console.error('Erro ao definir grupo de permissão:', error);
            return false;
          }
        }}
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
