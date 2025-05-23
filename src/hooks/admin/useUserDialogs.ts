
import { useState } from "react";

export const useUserDialogs = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserStatus, setSelectedUserStatus] = useState(false);
  const [selectedUserPermissionGroupId, setSelectedUserPermissionGroupId] = useState<string | null>(null);

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  const handleDeleteUser = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setShowDeleteDialog(true);
  };

  const handleToggleUserStatus = (userId: string, email: string, isActive: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserStatus(isActive);
    setShowStatusDialog(true);
  };

  const handleResetPassword = (email: string) => {
    setSelectedUserEmail(email);
    setShowResetDialog(true);
  };

  const handleSetPermissionGroup = (userId: string, email: string, permissionGroupId: string | null) => {
    console.log("handleSetPermissionGroup called:", { userId, email, permissionGroupId });
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
    selectedUserEmail,
    selectedUserId,
    selectedUserStatus,
    selectedUserPermissionGroupId,
    handleAddUser,
    handleInviteUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleResetPassword,
    handleSetPermissionGroup,
  };
};
