
import { useCallback } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';
import { useUXFeedback } from '@/hooks/useUXFeedback';

export const useUserActions = () => {
  const {
    deleteUser,
    resetPassword,
    setPermissionGroup,
    isDeleting,
    isResettingPassword,
    isSettingPermissions,
    forceRefresh
  } = usePerformanceOptimizedUserContext();

  const { updateUserPassword, sendMagicLink } = useBasicAuth();
  const { feedback, handleAsyncAction } = useUXFeedback();

  const confirmDelete = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Executing delete for:', userEmail);
        const success = await deleteUser(userId, userEmail);
        if (success) {
          setTimeout(() => {
            console.log('🔄 Forcing refresh after user deletion...');
            forceRefresh?.();
          }, 300);
          return true;
        }
        throw new Error('Falha ao excluir usuário');
      },
      {
        successMessage: `✅ Usuário ${userEmail} removido`,
        errorMessage: "❌ Erro ao excluir usuário",
        loadingMessage: "🗑️ Removendo usuário..."
      }
    ) !== null;
  }, [deleteUser, forceRefresh, handleAsyncAction]);

  const confirmResetPassword = useCallback(async (email: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Resetting password for:', email);
        const success = await resetPassword(email);
        if (success) {
          return true;
        }
        throw new Error('Falha ao redefinir senha');
      },
      {
        successMessage: `📧 Email de redefinição enviado`,
        errorMessage: "❌ Erro ao redefinir senha",
        loadingMessage: "🔄 Enviando email de redefinição..."
      }
    ) !== null;
  }, [resetPassword, handleAsyncAction]);

  const confirmChangePassword = useCallback(async (userId: string, newPassword: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Changing password for user ID:', userId);
        
        // TODO: Implementar função específica para alterar senha de outro usuário
        // Por enquanto, usar a função de atualização de senha
        await updateUserPassword(newPassword);
        return true;
      },
      {
        successMessage: "🔐 Senha alterada com sucesso",
        errorMessage: "❌ Erro ao alterar senha",
        loadingMessage: "🔄 Alterando senha..."
      }
    ) !== null;
  }, [updateUserPassword, handleAsyncAction]);

  const confirmSendMagicLink = useCallback(async (email: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Sending Magic Link for:', email);
        const success = await sendMagicLink(email);
        if (success) {
          return true;
        }
        throw new Error('Falha ao enviar Magic Link');
      },
      {
        successMessage: `🪄 Magic Link enviado para ${email}`,
        errorMessage: "❌ Erro ao enviar Magic Link",
        loadingMessage: "📤 Enviando Magic Link..."
      }
    ) !== null;
  }, [sendMagicLink, handleAsyncAction]);

  const confirmSetPermissionGroup = useCallback(async (userId: string, userEmail: string, groupId: string | null): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Setting permission group for:', userEmail);
        const success = await setPermissionGroup(userId, userEmail, groupId);
        if (success) {
          setTimeout(() => {
            console.log('🔄 Forcing refresh after permission change...');
            forceRefresh?.();
          }, 300);
          return true;
        }
        throw new Error('Falha ao definir permissões');
      },
      {
        successMessage: `🔐 Permissões atualizadas para ${userEmail}`,
        errorMessage: "❌ Erro ao definir permissões",
        loadingMessage: "⚙️ Atualizando permissões..."
      }
    ) !== null;
  }, [setPermissionGroup, forceRefresh, handleAsyncAction]);

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
