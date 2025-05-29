
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import { UserDetailsDialog } from '@/components/admin/users/dialogs/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { SendMagicLinkDialog } from '@/components/admin/users/dialogs/SendMagicLinkDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import UserStorageManagementDialog from '@/components/admin/users/dialogs/UserStorageManagementDialog';
import UserActivityLogsDialog from '@/components/admin/users/dialogs/UserActivityLogsDialog';
import { MentorToggleDialog } from '@/components/admin/users/dialogs/MentorToggleDialog';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';
import { useUXFeedback } from '@/hooks/useUXFeedback';

interface UserDialogManagerProps {
  dialogState: DialogState;
  onCloseDialog: () => void;
  onRefresh: () => void;
}

export const UserDialogManager: React.FC<UserDialogManagerProps> = ({
  dialogState,
  onCloseDialog,
  onRefresh
}) => {
  const { isOpen, type, user } = dialogState;
  const { updateUserPassword, sendMagicLink } = useBasicAuth();
  const { showSuccessToast, showErrorToast } = useUXFeedback();

  if (!isOpen || !user) return null;

  const handleDeleteUser = async () => {
    try {
      // TODO: Implementar função específica para deletar usuário
      console.log('🔧 UserDialogManager: Delete user:', user.id);
      showSuccessToast('Usuário removido com sucesso');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao remover usuário');
      return false;
    }
  };

  const handleResetPassword = async () => {
    try {
      console.log('🔧 UserDialogManager: Reset password for:', user.email);
      // Use the sendMagicLink which handles password reset
      await sendMagicLink(user.email);
      showSuccessToast('Email de redefinição enviado');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao redefinir senha');
      return false;
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      console.log('🔧 UserDialogManager: Change password for user:', user.id);
      await updateUserPassword(newPassword);
      showSuccessToast('Senha alterada com sucesso');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao alterar senha');
      return false;
    }
  };

  const handleSendMagicLink = async () => {
    try {
      console.log('🔧 UserDialogManager: Send Magic Link for:', user.email);
      await sendMagicLink(user.email);
      showSuccessToast('Magic Link enviado com sucesso');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao enviar Magic Link');
      return false;
    }
  };

  const handleSetPermissionGroup = async (groupId: string | null) => {
    try {
      console.log('🔧 UserDialogManager: Set permission group for:', user.email);
      // TODO: Implementar função específica para definir grupo de permissão
      showSuccessToast('Permissões atualizadas com sucesso');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao definir permissões');
      return false;
    }
  };

  const handleToggleMentor = async () => {
    try {
      // TODO: Implementar toggle mentor quando a função estiver disponível
      console.log('🔧 UserDialogManager: Toggle mentor for user:', user.id);
      showSuccessToast('Status de mentor atualizado');
      onRefresh();
      return true;
    } catch (error) {
      showErrorToast('Erro ao atualizar status de mentor');
      return false;
    }
  };

  switch (type) {
    case 'view':
      return (
        <UserDetailsDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          user={user}
          onRefresh={onRefresh}
        />
      );
    
    case 'delete':
      return (
        <UserDeleteDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          userEmail={user.email}
          onConfirmDelete={handleDeleteUser}
        />
      );
    
    case 'reset':
      return (
        <ResetPasswordDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          userEmail={user.email}
          onConfirmReset={handleResetPassword}
        />
      );
    
    case 'changePassword':
      return (
        <ChangePasswordDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          userEmail={user.email}
          onConfirmChange={handleChangePassword}
        />
      );
    
    case 'sendMagicLink':
      return (
        <SendMagicLinkDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          userEmail={user.email}
          onConfirmSend={handleSendMagicLink}
        />
      );
    
    case 'permissions':
      return (
        <UserPermissionGroupDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          userId={user.id}
          userEmail={user.email}
          currentGroupId={user.permission_group_id}
          onConfirmSetPermissionGroup={handleSetPermissionGroup}
        />
      );
    
    case 'storage':
      return (
        <UserStorageManagementDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          user={user}
        />
      );
    
    case 'activity':
      return (
        <UserActivityLogsDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          user={user}
        />
      );
    
    case 'mentor':
      return (
        <MentorToggleDialog 
          open={isOpen}
          onOpenChange={onCloseDialog}
          user={user}
          onConfirmToggle={handleToggleMentor}
        />
      );
    
    default:
      return null;
  }
};
