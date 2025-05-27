
import { useCallback } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { toast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const {
    deleteUser,
    toggleUserStatus,
    resetPassword,
    setPermissionGroup,
    isDeleting,
    isTogglingStatus,
    isResettingPassword,
    isSettingPermissions,
    refreshUsers
  } = usePerformanceOptimizedUserContext();

  const confirmDelete = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Executing delete for:', userEmail);
      const success = await deleteUser(userId, userEmail);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Usuário ${userEmail} excluído com sucesso.`,
        });
        // Força atualização após exclusão
        setTimeout(() => refreshUsers(), 500);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o usuário.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao excluir usuário.",
        variant: "destructive",
      });
      return false;
    }
  }, [deleteUser, refreshUsers]);

  const confirmToggleStatus = useCallback(async (userId: string, userEmail: string, currentStatus: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Toggling status for:', userEmail, 'Current:', currentStatus);
      const success = await toggleUserStatus(userId, userEmail, currentStatus);
      
      if (success) {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        console.log('✅ Status alterado para:', newStatus);
        
        // Não mostra toast aqui pois já é mostrado no diálogo
        // Força atualização após alteração de status
        setTimeout(() => refreshUsers(), 500);
      } else {
        console.error('❌ Falha ao alterar status');
      }
      return success;
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      return false;
    }
  }, [toggleUserStatus, refreshUsers]);

  const confirmResetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Resetting password for:', email);
      const success = await resetPassword(email);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Email de redefinição de senha enviado para ${email}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível redefinir a senha.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao redefinir senha.",
        variant: "destructive",
      });
      return false;
    }
  }, [resetPassword]);

  const confirmSetPermissionGroup = useCallback(async (userId: string, userEmail: string, groupId: string | null): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Setting permission group for:', userEmail);
      const success = await setPermissionGroup(userId, userEmail, groupId);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Permissões atualizadas para ${userEmail}.`,
        });
        // Força atualização após alteração de permissões
        setTimeout(() => refreshUsers(), 500);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível definir o grupo de permissão.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Erro ao definir grupo de permissão:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao definir permissões.",
        variant: "destructive",
      });
      return false;
    }
  }, [setPermissionGroup, refreshUsers]);

  return {
    confirmDelete,
    confirmToggleStatus,
    confirmResetPassword,
    confirmSetPermissionGroup,
    isDeleting,
    isTogglingStatus,
    isResettingPassword,
    isSettingPermissions
  };
};
