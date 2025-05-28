
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
    refreshUsers,
    forceRefresh
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
        
        // Force immediate refresh
        setTimeout(() => {
          console.log('🔄 Forcing refresh after user deletion...');
          forceRefresh?.();
        }, 300);
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
  }, [deleteUser, forceRefresh]);

  const confirmToggleStatus = useCallback(async (userId: string, userEmail: string, currentStatus: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Toggling status for:', userEmail, 'Current:', currentStatus);
      
      // Show immediate feedback
      const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
      console.log(`🎯 UserActions: Alterando ${userEmail} de ${currentStatus} para ${newStatus}`);
      
      const success = await toggleUserStatus(userId, userEmail, currentStatus);
      
      if (success) {
        console.log('✅ UserActions: Status alterado com sucesso para:', newStatus);
        
        // Multiple verification attempts
        let verificationAttempts = 0;
        const maxAttempts = 3;
        
        const verifyChange = async () => {
          verificationAttempts++;
          console.log(`🔍 UserActions: Tentativa de verificação ${verificationAttempts}/${maxAttempts}`);
          
          await forceRefresh?.();
          
          if (verificationAttempts < maxAttempts) {
            setTimeout(verifyChange, 1000);
          } else {
            console.log('✅ UserActions: Processo de verificação concluído');
          }
        };
        
        // Start verification process
        setTimeout(verifyChange, 200);
        
      } else {
        console.error('❌ UserActions: Falha ao alterar status');
      }
      return success;
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      return false;
    }
  }, [toggleUserStatus, forceRefresh]);

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
        
        // Force refresh after permission change
        setTimeout(() => {
          console.log('🔄 Forcing refresh after permission change...');
          forceRefresh?.();
        }, 300);
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
  }, [setPermissionGroup, forceRefresh]);

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
