
import React from 'react';
import { DialogState } from '../../hooks/useUserDialogs';
import { UserDetailsDialog } from '@/components/admin/users/dialogs/UserDetailsDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { ChangePasswordDialog } from '@/components/admin/users/dialogs/ChangePasswordDialog';
import { SendMagicLinkDialog } from '@/components/admin/users/dialogs/SendMagicLinkDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';
import { UserStorageManagementDialog } from '@/components/admin/users/dialogs/UserStorageManagementDialog';
import { UserActivityLogsDialog } from '@/components/admin/users/dialogs/UserActivityLogsDialog';
import { MentorToggleDialog } from '@/components/admin/users/dialogs/MentorToggleDialog';

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

  if (!isOpen || !user) return null;

  const commonProps = {
    open: isOpen,
    onOpenChange: onCloseDialog,
    user,
    onSuccess: () => {
      onCloseDialog();
      onRefresh();
    }
  };

  switch (type) {
    case 'view':
      return <UserDetailsDialog {...commonProps} />;
    
    case 'delete':
      return <UserDeleteDialog {...commonProps} />;
    
    case 'reset':
      return <ResetPasswordDialog {...commonProps} />;
    
    case 'changePassword':
      return <ChangePasswordDialog {...commonProps} />;
    
    case 'sendMagicLink':
      return <SendMagicLinkDialog {...commonProps} />;
    
    case 'permissions':
      return <UserPermissionGroupDialog {...commonProps} />;
    
    case 'storage':
      return <UserStorageManagementDialog {...commonProps} />;
    
    case 'activity':
      return <UserActivityLogsDialog {...commonProps} />;
    
    case 'mentor':
      return <MentorToggleDialog {...commonProps} />;
    
    default:
      return null;
  }
};
