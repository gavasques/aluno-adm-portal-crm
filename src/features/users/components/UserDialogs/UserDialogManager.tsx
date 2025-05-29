
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
import { useUserActions } from '../../hooks/useUserActions';

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
  const {
    confirmDelete,
    confirmResetPassword,
    confirmChangePassword,
    confirmSendMagicLink,
    confirmSetPermissionGroup
  } = useUserActions();

  if (!isOpen || !user) return null;

  const handleDeleteUser = async () => {
    const success = await confirmDelete(user.id, user.email);
    if (success) {
      onRefresh();
    }
    return success;
  };

  const handleResetPassword = async () => {
    const success = await confirmResetPassword(user.email);
    if (success) {
      onRefresh();
    }
    return success;
  };

  const handleChangePassword = async (newPassword: string) => {
    const success = await confirmChangePassword(user.id, newPassword);
    if (success) {
      onRefresh();
    }
    return success;
  };

  const handleSendMagicLink = async () => {
    const success = await confirmSendMagicLink(user.email);
    if (success) {
      onRefresh();
    }
    return success;
  };

  const handleSetPermissionGroup = async (groupId: string | null) => {
    const success = await confirmSetPermissionGroup(user.id, user.email, groupId);
    if (success) {
      onRefresh();
    }
    return success;
  };

  const handleToggleMentor = async () => {
    // TODO: Implementar toggle mentor quando a função estiver disponível
    console.log('Toggle mentor for user:', user.id);
    return true;
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
