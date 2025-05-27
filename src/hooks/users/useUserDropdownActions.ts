
import { useState, useCallback } from 'react';
import { User } from '@/types/user.types';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { toast } from '@/hooks/use-toast';

export const useUserDropdownActions = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const {
    deleteUser,
    toggleUserStatus,
    resetPassword,
    setPermissionGroup,
    isDeleting,
    isTogglingStatus,
    isResettingPassword,
    isSettingPermissions
  } = usePerformanceOptimizedUserContext();

  const handleViewDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  }, []);

  const handleResetPassword = useCallback((user: User) => {
    setSelectedUser(user);
    setShowResetDialog(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  }, []);

  const handleToggleUserStatus = useCallback((user: User) => {
    setSelectedUser(user);
    setShowStatusDialog(true);
  }, []);

  const handleSetPermissionGroup = useCallback((user: User) => {
    setSelectedUser(user);
    setShowPermissionDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedUser) return false;
    
    try {
      const success = await deleteUser(selectedUser.id, selectedUser.email);
      if (success) {
        setShowDeleteDialog(false);
        setSelectedUser(null);
      }
      return success;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return false;
    }
  }, [selectedUser, deleteUser]);

  const confirmToggleStatus = useCallback(async () => {
    if (!selectedUser) return false;
    
    try {
      const success = await toggleUserStatus(selectedUser.id, selectedUser.email, selectedUser.status);
      if (success) {
        setShowStatusDialog(false);
        setSelectedUser(null);
      }
      return success;
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      return false;
    }
  }, [selectedUser, toggleUserStatus]);

  const confirmResetPassword = useCallback(async () => {
    if (!selectedUser) return false;
    
    try {
      const success = await resetPassword(selectedUser.email);
      if (success) {
        setShowResetDialog(false);
        setSelectedUser(null);
      }
      return success;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return false;
    }
  }, [selectedUser, resetPassword]);

  const confirmSetPermissionGroup = useCallback(async (groupId: string | null) => {
    if (!selectedUser) return false;
    
    try {
      const success = await setPermissionGroup(selectedUser.id, selectedUser.email, groupId);
      if (success) {
        setShowPermissionDialog(false);
        setSelectedUser(null);
      }
      return success;
    } catch (error) {
      console.error('Erro ao definir grupo de permissão:', error);
      return false;
    }
  }, [selectedUser, setPermissionGroup]);

  const clearSelection = useCallback(() => {
    setSelectedUser(null);
    setShowDetailsDialog(false);
    setShowDeleteDialog(false);
    setShowStatusDialog(false);
    setShowResetDialog(false);
    setShowPermissionDialog(false);
  }, []);

  return {
    // State
    selectedUser,
    showDetailsDialog,
    showDeleteDialog,
    showStatusDialog,
    showResetDialog,
    showPermissionDialog,

    // Dialog setters
    setShowDetailsDialog,
    setShowDeleteDialog,
    setShowStatusDialog,
    setShowResetDialog,
    setShowPermissionDialog,

    // Action handlers
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSetPermissionGroup,

    // Confirmation handlers
    confirmDelete,
    confirmToggleStatus,
    confirmResetPassword,
    confirmSetPermissionGroup,

    // Utility
    clearSelection,

    // Loading states
    isDeleting,
    isTogglingStatus,
    isResettingPassword,
    isSettingPermissions
  };
};
