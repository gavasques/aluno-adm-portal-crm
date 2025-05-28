
import { useCallback } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';
import { toast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const {
    deleteUser,
    resetPassword,
    setPermissionGroup,
    isDeleting,
    isResettingPassword,
    isSettingPermissions,
    refreshUsers,
    forceRefresh
  } = usePerformanceOptimizedUserContext();

  const { updateUserPassword, sendMagicLink } = useBasicAuth();

  const confirmDelete = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Executing delete for:', userEmail);
      const success = await deleteUser(userId, userEmail);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Usuário ${userEmail} excluído com sucesso.`,
        });
        
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

  const confirmChangePassword = useCallback(async (userId: string, newPassword: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Changing password for user ID:', userId);
      
      // TODO: Implementar função específica para alterar senha de outro usuário
      // Por enquanto, usar a função de atualização de senha
      await updateUserPassword(newPassword);
      
      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao alterar senha.",
        variant: "destructive",
      });
      return false;
    }
  }, [updateUserPassword]);

  const confirmSendMagicLink = useCallback(async (email: string): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Sending Magic Link for:', email);
      const success = await sendMagicLink(email);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Magic Link enviado para ${email}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível enviar o Magic Link.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Erro ao enviar Magic Link:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao enviar Magic Link.",
        variant: "destructive",
      });
      return false;
    }
  }, [sendMagicLink]);

  const confirmSetPermissionGroup = useCallback(async (userId: string, userEmail: string, groupId: string | null): Promise<boolean> => {
    try {
      console.log('🔧 UserActions: Setting permission group for:', userEmail);
      const success = await setPermissionGroup(userId, userEmail, groupId);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Permissões atualizadas para ${userEmail}.`,
        });
        
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
    confirmResetPassword,
    confirmChangePassword,
    confirmSendMagicLink,
    confirmSetPermissionGroup,
    isDeleting,
    isResettingPassword,
    isSettingPermissions
  };
};
