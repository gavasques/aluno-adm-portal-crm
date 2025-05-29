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
        console.log('🔧 [HOOK] UserActions: Executando exclusão para:', userEmail, 'ID:', userId);
        console.log('🔧 [HOOK] Timestamp:', new Date().toISOString());
        
        if (!userId || !userEmail) {
          throw new Error('ID do usuário e email são obrigatórios para exclusão');
        }
        
        console.log('🚀 [HOOK] Chamando deleteUserFromDatabase...');
        const success = await deleteUserFromDatabase(userId, userEmail);
        console.log('🔧 [HOOK] UserActions: Resultado da exclusão:', success);
        
        if (!success) {
          throw new Error('Falha ao excluir usuário - operação retornou false');
        }
        
        // Aguardar um pouco antes de forçar refresh para garantir que a operação foi processada
        console.log('⏳ [HOOK] Aguardando 2 segundos antes do refresh...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('🔄 [HOOK] Forçando refresh após exclusão bem-sucedida...');
        await forceRefresh?.();
        
        console.log('✅ [HOOK] Processo de exclusão completo');
        return true;
      },
      {
        successMessage: `✅ Usuário ${userEmail} removido com sucesso`,
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
