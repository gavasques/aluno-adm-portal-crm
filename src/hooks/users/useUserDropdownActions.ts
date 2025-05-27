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
    console.log('🔧 handleViewDetails executado para:', user.email);
    console.log('🔧 Estado antes:', { selectedUser: selectedUser?.email, showDetailsDialog });
    setSelectedUser(user);
    setShowDetailsDialog(true);
    console.log('🔧 Estado depois será:', { selectedUser: user.email, showDetailsDialog: true });
  }, [selectedUser, showDetailsDialog]);

  const handleResetPassword = useCallback((user: User) => {
    console.log('🔧 handleResetPassword executado para:', user.email);
    console.log('🔧 Estado antes:', { selectedUser: selectedUser?.email, showResetDialog });
    setSelectedUser(user);
    setShowResetDialog(true);
    console.log('🔧 Estado depois será:', { selectedUser: user.email, showResetDialog: true });
  }, [selectedUser, showResetDialog]);

  const handleDeleteUser = useCallback((user: User) => {
    console.log('🔧 handleDeleteUser executado para:', user.email);
    console.log('🔧 Estado antes:', { selectedUser: selectedUser?.email, showDeleteDialog });
    setSelectedUser(user);
    setShowDeleteDialog(true);
    console.log('🔧 Estado depois será:', { selectedUser: user.email, showDeleteDialog: true });
  }, [selectedUser, showDeleteDialog]);

  const handleToggleUserStatus = useCallback((user: User) => {
    console.log('🔧 handleToggleUserStatus executado para:', user.email);
    console.log('🔧 Estado antes:', { selectedUser: selectedUser?.email, showStatusDialog });
    setSelectedUser(user);
    setShowStatusDialog(true);
    console.log('🔧 Estado depois será:', { selectedUser: user.email, showStatusDialog: true });
  }, [selectedUser, showStatusDialog]);

  const handleSetPermissionGroup = useCallback((user: User) => {
    console.log('🔧 handleSetPermissionGroup executado para:', user.email);
    console.log('🔧 Estado antes:', { selectedUser: selectedUser?.email, showPermissionDialog });
    setSelectedUser(user);
    setShowPermissionDialog(true);
    console.log('🔧 Estado depois será:', { selectedUser: user.email, showPermissionDialog: true });
  }, [selectedUser, showPermissionDialog]);

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
