
import React from "react";
import UserAddDialog from "./UserAddDialog";
import UserInviteDialog from "./UserInviteDialog";
import UserDeleteDialog from "./UserDeleteDialog";
import UserStatusDialog from "./UserStatusDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import UserPermissionGroupDialog from "./UserPermissionGroupDialog";

interface UsersDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showStatusDialog: boolean;
  setShowStatusDialog: (show: boolean) => void;
  showResetDialog: boolean;
  setShowResetDialog: (show: boolean) => void;
  showPermissionDialog?: boolean;
  setShowPermissionDialog?: (show: boolean) => void;
  selectedUserEmail: string;
  selectedUserId: string;
  selectedUserStatus: boolean;
  selectedUserPermissionGroupId?: string | null;
  onSuccess: () => void;
}

const UsersDialogs: React.FC<UsersDialogsProps> = ({
  showAddDialog,
  setShowAddDialog,
  showInviteDialog,
  setShowInviteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  showStatusDialog,
  setShowStatusDialog,
  showResetDialog,
  setShowResetDialog,
  showPermissionDialog = false,
  setShowPermissionDialog,
  selectedUserEmail,
  selectedUserId,
  selectedUserStatus,
  selectedUserPermissionGroupId,
  onSuccess
}) => {
  return (
    <>
      {/* Diálogo para adicionar usuário */}
      <UserAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={onSuccess}
      />

      {/* Diálogo para convidar usuário */}
      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={onSuccess}
      />

      {/* Diálogo para excluir usuário */}
      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userEmail={selectedUserEmail}
        userId={selectedUserId}
        onSuccess={onSuccess}
      />

      {/* Diálogo para alternar status do usuário */}
      <UserStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        userEmail={selectedUserEmail}
        userId={selectedUserId}
        isActive={selectedUserStatus}
        onSuccess={onSuccess}
      />

      {/* Diálogo para redefinir senha */}
      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={selectedUserEmail}
      />
      
      {/* Diálogo para definir grupo de permissão */}
      {setShowPermissionDialog && (
        <UserPermissionGroupDialog
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
          userId={selectedUserId}
          userEmail={selectedUserEmail}
          currentGroupId={selectedUserPermissionGroupId || null}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default UsersDialogs;
