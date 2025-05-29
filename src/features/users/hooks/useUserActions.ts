
import { useCallback } from 'react';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { usePerformanceOptimizedUsers } from '@/hooks/usePerformanceOptimizedUserContext';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';

export const useUserActions = () => {
  const { deleteUserFromDatabase, forceRefresh } = usePerformanceOptimizedUsers();
  const { sendMagicLink, updateUserPassword } = useBasicAuth();
  const { handleAsyncAction } = useUXFeedback();

  const confirmDelete = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Executing delete for:', userEmail);
        const success = await deleteUserFromDatabase(userId, userEmail);
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
  }, [deleteUserFromDatabase, forceRefresh, handleAsyncAction]);

  const confirmResetPassword = useCallback(async (email: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Resetting password for:', email);
        const success = await sendMagicLink(email);
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
  }, [sendMagicLink, handleAsyncAction]);

  const confirmChangePassword = useCallback(async (userId: string, newPassword: string): Promise<boolean> => {
    return await handleAsyncAction(
      async () => {
        console.log('🔧 UserActions: Changing password for user ID:', userId);
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
        // TODO: Implementar função específica para definir grupo de permissão
        return true;
      },
      {
        successMessage: `🔐 Permissões atualizadas para ${userEmail}`,
        errorMessage: "❌ Erro ao definir permissões",
        loadingMessage: "⚙️ Atualizando permissões..."
      }
    ) !== null;
  }, [handleAsyncAction]);

  return {
    confirmDelete,
    confirmResetPassword,
    confirmChangePassword,
    confirmSendMagicLink,
    confirmSetPermissionGroup
  };
};
