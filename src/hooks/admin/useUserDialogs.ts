
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useUserDialogs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [selectedUserStatus, setSelectedUserStatus] = useState<boolean>(true);
  const [selectedUserPermissionGroupId, setSelectedUserPermissionGroupId] = useState<string | null>(null);

  // Handler para abrir o diálogo de adicionar usuário
  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  // Handler para abrir o diálogo de enviar convite
  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  // Handler para abrir o diálogo de excluir usuário
  const handleDeleteUser = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setShowDeleteDialog(true);
  };

  // Handler para abrir o diálogo de alternar status do usuário
  const handleToggleUserStatus = (userId: string, email: string, isActive: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserStatus(isActive);
    setShowStatusDialog(true);
  };

  // Handler para abrir o diálogo de redefinir senha
  const handleResetPassword = (email: string) => {
    setSelectedUserEmail(email);
    setShowResetDialog(true);
  };

  // Handler para abrir o diálogo de permissão de grupo
  const handleSetPermissionGroup = (userId: string, email: string, permissionGroupId: string | null) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserPermissionGroupId(permissionGroupId);
    setShowPermissionDialog(true);
  };

  return {
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
    showPermissionDialog,
    setShowPermissionDialog,
    selectedUserId,
    selectedUserEmail,
    selectedUserStatus,
    selectedUserPermissionGroupId,
    handleAddUser,
    handleInviteUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleResetPassword,
    handleSetPermissionGroup
  };
};
