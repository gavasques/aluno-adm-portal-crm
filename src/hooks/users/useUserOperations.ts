
import { useState } from 'react';
import { useUsers } from './useUsers';

export const useUserOperations = () => {
  const {
    createUser,
    deleteUser,
    resetPassword,
    setPermissionGroup
  } = useUsers();

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Selected user states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserPermissionGroupId, setSelectedUserPermissionGroupId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  const handleResetPassword = (email: string) => {
    setSelectedUserEmail(email);
    setShowResetDialog(true);
  };

  const handleSetPermissionGroup = (userId: string, email: string, permissionGroupId: string | null) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setSelectedUserPermissionGroupId(permissionGroupId);
    setShowPermissionDialog(true);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const closeAllDialogs = () => {
    setShowAddDialog(false);
    setShowInviteDialog(false);
    setShowDeleteDialog(false);
    setShowResetDialog(false);
    setShowPermissionDialog(false);
    setShowDetailsDialog(false);
    setSelectedUserId("");
    setSelectedUserEmail("");
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    const success = await deleteUser(selectedUserId, selectedUserEmail);
    if (success) {
      closeAllDialogs();
    }
    return success;
  };

  const confirmResetPassword = async () => {
    const success = await resetPassword(selectedUserEmail);
    if (success) {
      closeAllDialogs();
    }
    return success;
  };

  const confirmSetPermissionGroup = async (groupId: string | null) => {
    const success = await setPermissionGroup(selectedUserId, selectedUserEmail, groupId);
    if (success) {
      closeAllDialogs();
    }
    return success;
  };

  return {
    // Dialog states
    showAddDialog,
    setShowAddDialog,
    showInviteDialog,
    setShowInviteDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showResetDialog,
    setShowResetDialog,
    showPermissionDialog,
    setShowPermissionDialog,
    showDetailsDialog,
    setShowDetailsDialog,

    // Selected user data
    selectedUserId,
    selectedUserEmail,
    selectedUserPermissionGroupId,
    selectedUser,

    // Handlers
    handleAddUser,
    handleInviteUser,
    handleDeleteUser,
    handleResetPassword,
    handleSetPermissionGroup,
    handleViewDetails,
    closeAllDialogs,

    // Confirmation actions
    confirmDelete,
    confirmResetPassword,
    confirmSetPermissionGroup,

    // Operations
    createUser,
  };
};
