
import { useState } from "react";

export const useUserDialogs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserStatus, setSelectedUserStatus] = useState(false);

  // Função para lidar com a redefinição de senha
  const handleResetPassword = (email: string) => {
    setSelectedUserEmail(email);
    setShowResetDialog(true);
  };

  // Função para abrir o diálogo de adicionar usuário
  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  // Função para abrir o diálogo de convidar usuário
  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  // Função para abrir o diálogo de excluir usuário
  const handleDeleteUser = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setShowDeleteDialog(true);
  };

  // Função para abrir o diálogo de alteração de status do usuário
  const handleToggleUserStatus = (userId: string, email: string, isActive: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserStatus(isActive);
    setShowStatusDialog(true);
  };

  return {
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
    handleResetPassword,
    handleAddUser,
    handleInviteUser,
    handleDeleteUser,
    handleToggleUserStatus
  };
};
