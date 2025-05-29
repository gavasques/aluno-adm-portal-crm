
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import UserDetailsDialog from '@/components/admin/users/dialogs/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { SendMagicLinkDialog } from '@/components/admin/users/dialogs/SendMagicLinkDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import UserStorageManagementDialog from '@/components/admin/users/dialogs/UserStorageManagementDialog';
import UserActivityLogsDialog from '@/components/admin/users/dialogs/UserActivityLogsDialog';
import { MentorToggleDialog } from '@/components/admin/users/dialogs/MentorToggleDialog';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';
import { toast } from 'react-hot-toast';

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
  const { deleteUser, resetPassword, changePassword, sendMagicLink, updateUserPermissionGroup, toggleMentorStatus } = useBasicAuth();

  if (!isOpen || !user) return null;

  const handleDeleteUser = async () => {
    try {
      const success = await deleteUser(user.id);
      if (success) {
        toast.success('Usuário excluído com sucesso');
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao excluir usuário');
      return false;
    }
  };

  const handleResetPassword = async () => {
    try {
      const success = await resetPassword(user.email);
      if (success) {
        toast.success('Email de redefinição enviado');
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao enviar email de redefinição');
      return false;
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      const success = await changePassword(user.id, newPassword);
      if (success) {
        toast.success('Senha alterada com sucesso');
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao alterar senha');
      return false;
    }
  };

  const handleSendMagicLink = async () => {
    try {
      const success = await sendMagicLink(user.email);
      if (success) {
        toast.success('Magic Link enviado');
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao enviar Magic Link');
      return false;
    }
  };

  const handleSetPermissionGroup = async (groupId: string | null) => {
    try {
      const success = await updateUserPermissionGroup(user.id, groupId);
      if (success) {
        toast.success('Grupo de permissão atualizado');
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao atualizar grupo de permissão');
      return false;
    }
  };

  const handleToggleMentor = async () => {
    try {
      const success = await toggleMentorStatus(user.id, !user.is_mentor);
      if (success) {
        toast.success(`Usuário ${user.is_mentor ? 'removido como' : 'tornado'} mentor`);
        onRefresh();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro ao alterar status de mentor');
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
