import { useCallback } from 'react';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { usePerformanceOptimizedUsers } from '@/hooks/users/usePerformanceOptimizedUsers';
import { useBasicAuth } from '@/hooks/auth/useBasicAuth';
import { userService } from '@/services/UserService';

export const useUserActions = () => {
  const { deleteUserFromDatabase, forceRefresh } = usePerformanceOptimizedUsers();
  const { sendMagicLink, updateUserPassword } = useBasicAuth();
  const { handleAsyncAction } = useUXFeedback();

  const confirmDelete = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    const actionId = crypto.randomUUID();
    console.log(`🔧 [HOOK-${actionId}] ===== UserActions.confirmDelete INICIADO =====`);
    console.log(`🔧 [HOOK-${actionId}] Executando exclusão para:`, userEmail, 'ID:', userId);
    console.log(`🔧 [HOOK-${actionId}] Timestamp:`, new Date().toISOString());
    console.log(`🔧 [HOOK-${actionId}] ================================================`);
    
    return await handleAsyncAction(
      async () => {
        if (!userId || !userEmail) {
          console.error(`❌ [HOOK-${actionId}] Parâmetros inválidos:`, { userId, userEmail });
          throw new Error('ID do usuário e email são obrigatórios para exclusão');
        }
        
        console.log(`🚀 [HOOK-${actionId}] Chamando deleteUserFromDatabase...`);
        const success = await deleteUserFromDatabase(userId, userEmail);
        console.log(`📊 [HOOK-${actionId}] Resultado da exclusão:`, success);
        
        if (!success) {
          console.error(`❌ [HOOK-${actionId}] deleteUserFromDatabase retornou false`);
          throw new Error('Falha ao excluir usuário - operação retornou false');
        }
        
        // Aguardar antes de forçar refresh para garantir que a operação foi processada
        console.log(`⏳ [HOOK-${actionId}] Aguardando 3 segundos antes do refresh...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`🔄 [HOOK-${actionId}] Forçando refresh após exclusão bem-sucedida...`);
        await forceRefresh?.();
        
        console.log(`✅ [HOOK-${actionId}] Processo de exclusão completo com sucesso`);
        return true;
      },
      {
        successMessage: `✅ Usuário ${userEmail} processado com sucesso`,
        errorMessage: "❌ Erro ao processar usuário",
        loadingMessage: "🗑️ Processando exclusão..."
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

  const confirmToggleMentor = useCallback(async (userId: string, userEmail: string, currentMentorStatus: boolean): Promise<boolean> => {
    const actionId = crypto.randomUUID();
    const action = currentMentorStatus ? 'remover' : 'tornar';
    
    console.log(`🎓 [HOOK-${actionId}] ===== UserActions.confirmToggleMentor INICIADO =====`);
    console.log(`🎓 [HOOK-${actionId}] Ação: ${action} mentor para:`, userEmail, 'ID:', userId);
    console.log(`🎓 [HOOK-${actionId}] Status atual:', currentMentorStatus);
    console.log(`🎓 [HOOK-${actionId}] Timestamp:`, new Date().toISOString());
    console.log(`🎓 [HOOK-${actionId}] ================================================`);
    
    return await handleAsyncAction(
      async () => {
        if (!userId || !userEmail) {
          console.error(`❌ [HOOK-${actionId}] Parâmetros inválidos:`, { userId, userEmail });
          throw new Error('ID do usuário e email são obrigatórios para alterar status de mentor');
        }
        
        console.log(`🚀 [HOOK-${actionId}] Chamando toggleMentorStatus...`);
        const success = await userService.toggleMentorStatus(userId, userEmail, currentMentorStatus);
        console.log(`📊 [HOOK-${actionId}] Resultado da alteração:`, success);
        
        if (!success) {
          console.error(`❌ [HOOK-${actionId}] toggleMentorStatus retornou false`);
          throw new Error('Falha ao alterar status de mentor - operação retornou false');
        }
        
        // Aguardar antes de forçar refresh para garantir que a operação foi processada
        console.log(`⏳ [HOOK-${actionId}] Aguardando 2 segundos antes do refresh...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`🔄 [HOOK-${actionId}] Forçando refresh após alteração bem-sucedida...`);
        await forceRefresh?.();
        
        console.log(`✅ [HOOK-${actionId}] Processo de alteração de mentor completo com sucesso`);
        return true;
      },
      {
        successMessage: `🎓 Status de mentor atualizado para ${userEmail}`,
        errorMessage: "❌ Erro ao alterar status de mentor",
        loadingMessage: `🔄 ${currentMentorStatus ? 'Removendo' : 'Adicionando'} status de mentor...`
      }
    ) !== null;
  }, [userService, forceRefresh, handleAsyncAction]);

  return {
    confirmDelete,
    confirmResetPassword,
    confirmChangePassword,
    confirmSendMagicLink,
    confirmSetPermissionGroup,
    confirmToggleMentor
  };
};
