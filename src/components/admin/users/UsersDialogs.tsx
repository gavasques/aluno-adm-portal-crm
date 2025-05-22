
import React from "react";
import UserAddDialog from "./UserAddDialog";
import UserInviteDialog from "./UserInviteDialog";
import UserDeleteDialog from "./UserDeleteDialog";
import UserStatusDialog from "./UserStatusDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

interface UsersDialogsProps {
  // Changed prop names to match what's passed from Users.tsx
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
  showDeleteDialog,
  setShowDeleteDialog,
  showStatusDialog,
  setShowStatusDialog,
  showResetDialog,
  setShowResetDialog,
  selectedUserEmail,
  selectedUserId,
  selectedUserStatus,
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
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleSuccess}
      />

      <UserInviteDialog 
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={handleSuccess}
      />

      <UserDeleteDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        onSuccess={handleSuccess}
      />

      <UserStatusDialog 
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
        currentStatus={selectedUserStatus ? "Ativo" : "Inativo"} // Convert boolean to string status
        onSuccess={handleSuccess}
      />

      <ResetPasswordDialog 
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={selectedUserEmail}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default UsersDialogs;
