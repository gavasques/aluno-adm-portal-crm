
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UXFeedbackOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  duration?: number;
}

export function useUXFeedback() {
  const showLoadingToast = useCallback((message: string = "Processando...") => {
    return toast.loading(message);
  }, []);

  const showSuccessToast = useCallback((message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 4000
    });
  }, []);

  const showErrorToast = useCallback((message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 6000
    });
  }, []);

  const showInfoToast = useCallback((message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 5000
    });
  }, []);

  const showWarningToast = useCallback((message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 5000
    });
  }, []);

  // Helper for common CRUD operations
  const handleAsyncAction = useCallback(async <T>(
    action: () => Promise<T>,
    options: UXFeedbackOptions = {}
  ): Promise<T | null> => {
    const {
      successMessage = "Operação realizada com sucesso",
      errorMessage = "Erro ao realizar operação",
      loadingMessage = "Processando..."
    } = options;

    let loadingToastId: string | number | undefined;

    try {
      // Show loading toast
      loadingToastId = showLoadingToast(loadingMessage);

      // Execute action
      const result = await action();

      // Dismiss loading and show success
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      showSuccessToast(successMessage);

      return result;
    } catch (error) {
      // Dismiss loading and show error
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      const errorDesc = error instanceof Error ? error.message : 'Erro desconhecido';
      showErrorToast(errorMessage, errorDesc);
      
      console.error('Action failed:', error);
      return null;
    }
  }, [showLoadingToast, showSuccessToast, showErrorToast]);

  // Specific helpers for common operations
  const feedback = {
    // User operations
    userCreated: () => showSuccessToast("✅ Usuário criado", "O usuário foi criado com sucesso"),
    userUpdated: () => showSuccessToast("✅ Usuário atualizado", "As informações foram salvas"),
    userDeleted: () => showSuccessToast("✅ Usuário removido", "O usuário foi excluído do sistema"),
    userInactivated: () => showWarningToast("⚠️ Usuário inativado", "O usuário foi inativado devido a dados associados"),
    userInvited: () => showSuccessToast("📧 Convite enviado", "O convite foi enviado por email"),
    
    // Data operations
    dataLoaded: () => showInfoToast("📊 Dados carregados", "Informações atualizadas"),
    dataSaved: () => showSuccessToast("💾 Dados salvos", "Suas alterações foram salvas"),
    dataDeleted: () => showSuccessToast("🗑️ Item removido", "O item foi excluído com sucesso"),
    
    // Permission operations
    permissionsUpdated: () => showSuccessToast("🔐 Permissões atualizadas", "As permissões foram aplicadas"),
    accessGranted: () => showSuccessToast("✅ Acesso liberado", "O usuário agora tem acesso"),
    accessRevoked: () => showSuccessToast("🚫 Acesso removido", "O acesso foi revogado"),
    
    // System operations
    systemReady: () => showInfoToast("🚀 Sistema pronto", "Todos os recursos foram carregados"),
    syncCompleted: () => showSuccessToast("🔄 Sincronização concluída", "Os dados estão atualizados"),
    
    // Error states
    networkError: () => showErrorToast("🌐 Erro de conexão", "Verifique sua conexão com a internet"),
    serverError: () => showErrorToast("⚠️ Erro no servidor", "Tente novamente em alguns instantes"),
    unauthorized: () => showErrorToast("🔒 Acesso negado", "Você não tem permissão para esta ação"),
    validationError: (message: string) => showErrorToast("📝 Dados inválidos", message),
    
    // Loading states
    loading: (message?: string) => showLoadingToast(message || "Carregando..."),
    processing: (message?: string) => showLoadingToast(message || "Processando..."),
    saving: (message?: string) => showLoadingToast(message || "Salvando..."),
    deleting: (message?: string) => showLoadingToast(message || "Removendo...")
  };

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showLoadingToast,
    showWarningToast,
    handleAsyncAction,
    feedback
  };
}
