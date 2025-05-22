
import React from "react";
import UserAddDialog from "@/components/admin/users/UserAddDialog";
import UserInviteDialog from "@/components/admin/users/UserInviteDialog";
import ResetPasswordDialog from "@/components/admin/users/ResetPasswordDialog";
import UserDeleteDialog from "@/components/admin/users/UserDeleteDialog";
import UserStatusDialog from "@/components/admin/users/UserStatusDialog";

interface UsersDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  showResetDialog: boolean;
  setShowResetDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showStatusDialog: boolean;
  setShowStatusDialog: (show: boolean) => void;
  selectedUserEmail: string;
  selectedUserId: string;
  selectedUserStatus: boolean;
  onSuccess: () => void;
}

const UsersDialogs: React.FC<UsersDialogsProps> = ({
  showAddDialog,
  setShowAddDialog,
  showInviteDialog,
  setShowInviteDialog,
  showResetDialog,
  setShowResetDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  showStatusDialog,
  setShowStatusDialog,
  selectedUserEmail,
  selectedUserId,
  selectedUserStatus,
  onSuccess
}) => {
  return (
    <>
      <UserAddDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={onSuccess}
      />

      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={onSuccess}
      />

      <ResetPasswordDialog 
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={selectedUserEmail}
      />

      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        onSuccess={onSuccess}
      />

      <UserStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        isActive={selectedUserStatus}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default UsersDialogs;
