
import React from 'react';
import { UserAddDialog } from '@/components/admin/users/dialogs/UserAddDialog';
import { UserInviteDialog } from '@/components/admin/users/dialogs/UserInviteDialog';
import { UserDeleteDialog } from '@/components/admin/users/dialogs/UserDeleteDialog';
import { ResetPasswordDialog } from '@/components/admin/users/dialogs/ResetPasswordDialog';
import { UserPermissionGroupDialog } from '@/components/admin/users/dialogs/UserPermissionGroupDialog';

interface UserOperationDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showResetDialog: boolean;
  setShowResetDialog: (show: boolean) => void;
  showPermissionDialog: boolean;
  setShowPermissionDialog: (show: boolean) => void;
  selectedUserId: string;
  selectedUserEmail: string;
  selectedUserPermissionGroupId: string | null;
  confirmDelete: () => Promise<boolean>;
  confirmResetPassword: () => Promise<boolean>;
  confirmSetPermissionGroup: (groupId: string | null) => Promise<boolean>;
  createUser: (userData: any) => Promise<boolean>;
  closeAllDialogs: () => void;
}

const UserOperationDialogs: React.FC<UserOperationDialogsProps> = (props) => {
  return (
    <>
      <UserAddDialog
        open={props.showAddDialog}
        onOpenChange={props.setShowAddDialog}
        onCreateUser={props.createUser}
      />

      <UserInviteDialog
        open={props.showInviteDialog}
        onOpenChange={props.setShowInviteDialog}
        onSuccess={() => props.closeAllDialogs()}
      />

      <UserDeleteDialog
        open={props.showDeleteDialog}
        onOpenChange={props.setShowDeleteDialog}
        userEmail={props.selectedUserEmail}
        onConfirm={props.confirmDelete}
      />

      <ResetPasswordDialog
        open={props.showResetDialog}
        onOpenChange={props.setShowResetDialog}
        userEmail={props.selectedUserEmail}
        onConfirm={props.confirmResetPassword}
      />

      <UserPermissionGroupDialog
        open={props.showPermissionDialog}
        onOpenChange={props.setShowPermissionDialog}
        userEmail={props.selectedUserEmail}
        currentPermissionGroupId={props.selectedUserPermissionGroupId}
        onConfirm={props.confirmSetPermissionGroup}
      />
    </>
  );
};

export default UserOperationDialogs;
