
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
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
          // TODO: Implementar lógica de exclusão
          console.log('Excluir usuário:', user.email);
          return true;
        }}
      />

      <ResetPasswordDialog
        open={isOpen && type === 'reset'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmReset={async () => {
          // TODO: Implementar lógica de reset
          console.log('Reset senha para:', user.email);
          return true;
        }}
      />

      <ChangePasswordDialog
        open={isOpen && type === 'changePassword'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmChange={async (newPassword: string) => {
          // TODO: Implementar lógica de alteração de senha
          console.log('Alterar senha para:', user.email);
          return true;
        }}
      />

      <SendMagicLinkDialog
        open={isOpen && type === 'sendMagicLink'}
        onOpenChange={onCloseDialog}
        userEmail={user.email}
        onConfirmSend={async () => {
          // TODO: Implementar lógica de envio de magic link
          console.log('Enviar Magic Link para:', user.email);
          return true;
        }}
      />

      <UserPermissionGroupDialog
        open={isOpen && type === 'permissions'}
        onOpenChange={onCloseDialog}
        userId={user.id}
        userEmail={user.email}
        currentGroupId={user.permission_group_id || null}
        onConfirmSetPermissionGroup={async (groupId: string | null) => {
          // TODO: Implementar lógica de permissão
          console.log('Definir grupo para:', user.email, groupId);
          return true;
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
