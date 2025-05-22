
import React from "react";
import UserAddDialog from "./UserAddDialog";
import UserInviteDialog from "./UserInviteDialog";
import UserDeleteDialog from "./UserDeleteDialog";
import UserStatusDialog from "./UserStatusDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

interface UsersDialogsProps {
  showAddUserDialog: boolean;
  setShowAddUserDialog: (show: boolean) => void;
  showInviteUserDialog: boolean;
  setShowInviteUserDialog: (show: boolean) => void;
  showDeleteUserDialog: boolean;
  setShowDeleteUserDialog: (show: boolean) => void;
  showStatusUserDialog: boolean;
  setShowStatusUserDialog: (show: boolean) => void;
  showResetPasswordDialog: boolean;
  setShowResetPasswordDialog: (show: boolean) => void;
  selectedUser: {
    id: string;
    email: string;
    status: string;
  } | null;
  onSuccess: () => void;
}

const UsersDialogs: React.FC<UsersDialogsProps> = ({
  showAddUserDialog,
  setShowAddUserDialog,
  showInviteUserDialog,
  setShowInviteUserDialog,
  showDeleteUserDialog,
  setShowDeleteUserDialog,
  showStatusUserDialog,
  setShowStatusUserDialog,
  showResetPasswordDialog,
  setShowResetPasswordDialog,
  selectedUser,
  onSuccess
}) => {
  // Função para garantir que a lista seja atualizada após qualquer operação
  const handleSuccess = () => {
    // Dar um pequeno atraso para garantir que a operação tenha sido concluída
    setTimeout(() => {
      onSuccess();
    }, 500);
  };

  return (
    <>
      <UserAddDialog 
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onSuccess={handleSuccess}
      />

      <UserInviteDialog 
        open={showInviteUserDialog}
        onOpenChange={setShowInviteUserDialog}
        onSuccess={handleSuccess}
      />

      <UserDeleteDialog 
        open={showDeleteUserDialog}
        onOpenChange={setShowDeleteUserDialog}
        userId={selectedUser?.id || ""}
        userEmail={selectedUser?.email || ""}
        onSuccess={handleSuccess}
      />

      <UserStatusDialog 
        open={showStatusUserDialog}
        onOpenChange={setShowStatusUserDialog}
        userId={selectedUser?.id || ""}
        userEmail={selectedUser?.email || ""}
        currentStatus={selectedUser?.status || ""}
        onSuccess={handleSuccess}
      />

      <ResetPasswordDialog 
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
        userEmail={selectedUser?.email || ""}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default UsersDialogs;
