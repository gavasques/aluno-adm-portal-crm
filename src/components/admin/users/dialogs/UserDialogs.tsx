
import React from "react";
import { UserAddDialog } from "./UserAddDialog";
import { UserInviteDialog } from "./UserInviteDialog";
import { UserDeleteDialog } from "./UserDeleteDialog";
import { UserStatusDialog } from "./UserStatusDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { UserPermissionGroupDialog } from "./UserPermissionGroupDialog";
import { UserDetailsDialog } from "./UserDetailsDialog";

interface UserDialogsProps {
  // Dialog states
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
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;

  // Selected user data
  selectedUserEmail: string;
  selectedUserId: string;
  selectedUserStatus: boolean;
  selectedUserPermissionGroupId?: string | null;
  selectedUser: any;

  // Operations
  onCreateUser: (userData: any) => Promise<boolean>;
  onConfirmDelete: () => Promise<boolean>;
  onConfirmToggleStatus: () => Promise<boolean>;
  onConfirmResetPassword: () => Promise<boolean>;
  onConfirmSetPermissionGroup: (groupId: string | null) => Promise<boolean>;
  onRefresh: () => void;
}

export const UserDialogs: React.FC<UserDialogsProps> = ({
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
  showDetailsDialog,
  setShowDetailsDialog,
  selectedUserEmail,
  selectedUserId,
  selectedUserStatus,
  selectedUserPermissionGroupId,
  selectedUser,
  onCreateUser,
  onConfirmDelete,
  onConfirmToggleStatus,
  onConfirmResetPassword,
  onConfirmSetPermissionGroup,
  onRefresh
}) => {
  return (
    <>
      {/* Diálogo para adicionar usuário */}
      <UserAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCreateUser={onCreateUser}
      />

      {/* Diálogo para convidar usuário */}
      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={onRefresh}
      />

      {/* Diálogo para excluir usuário */}
      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userEmail={selectedUserEmail}
        onConfirmDelete={onConfirmDelete}
      />

      {/* Diálogo para alternar status do usuário */}
      <UserStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        userEmail={selectedUserEmail}
        currentStatus={selectedUserStatus ? "Ativo" : "Inativo"}
        onConfirmToggleStatus={onConfirmToggleStatus}
      />

      {/* Diálogo para redefinir senha - corrigindo a prop */}
      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={selectedUserEmail}
        onConfirmReset={onConfirmResetPassword}
      />
      
      {/* Diálogo para definir grupo de permissão */}
      {setShowPermissionDialog && (
        <UserPermissionGroupDialog
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
          userId={selectedUserId}
          userEmail={selectedUserEmail}
          currentGroupId={selectedUserPermissionGroupId || null}
          onConfirmSetPermissionGroup={onConfirmSetPermissionGroup}
        />
      )}

      {/* Dialog de detalhes do usuário */}
      <UserDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        user={selectedUser}
        onRefresh={onRefresh}
      />
    </>
  );
};
