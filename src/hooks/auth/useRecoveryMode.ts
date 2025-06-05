
const RECOVERY_MODE_KEY = "supabase_recovery_mode";
const RECOVERY_EXPIRY_KEY = "supabase_recovery_expiry";
const RECOVERY_DURATION = 30 * 60 * 1000; // 30 minutos

export const recoveryModeUtils = {
  enableRecoveryMode: () => {
    const expiry = Date.now() + RECOVERY_DURATION;
    localStorage.setItem(RECOVERY_MODE_KEY, "true");
    localStorage.setItem(RECOVERY_EXPIRY_KEY, expiry.toString());
  },

  disableRecoveryMode: () => {
    localStorage.removeItem(RECOVERY_MODE_KEY);
    localStorage.removeItem(RECOVERY_EXPIRY_KEY);
  },

  clearAllRecoveryData: () => {
    localStorage.removeItem(RECOVERY_MODE_KEY);
    localStorage.removeItem(RECOVERY_EXPIRY_KEY);
  },

  isInRecoveryMode: (): boolean => {
    const recoveryMode = localStorage.getItem(RECOVERY_MODE_KEY);
    const expiry = localStorage.getItem(RECOVERY_EXPIRY_KEY);
    
    if (!recoveryMode || !expiry) {
      return false;
    }
    
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      // Modo expirado, limpar
      recoveryModeUtils.disableRecoveryMode();
      return false;
    }
    
    return recoveryMode === "true";
  },

  detectRecoveryFlow: (session: any, pathname: string): boolean => {
    // Detectar se estamos em um fluxo de recuperação de senha
    if (!session) return false;
    
    // Verificar se a URL contém parâmetros de recuperação
    const urlParams = new URLSearchParams(window.location.search);
    const hasRecoveryType = urlParams.get('type') === 'recovery';
    const isRecoveryPath = pathname.includes('reset-password');
    
    // Verificar se o usuário tem metadados de recuperação
    const hasRecoveryMetadata = session.user?.aud === 'recovery' || 
                               session.user?.app_metadata?.provider === 'recovery';
    
    return hasRecoveryType || isRecoveryPath || hasRecoveryMetadata;
  },

  setRecoveryMode: (enabled: boolean) => {
    if (enabled) {
      recoveryModeUtils.enableRecoveryMode();
    } else {
      recoveryModeUtils.disableRecoveryMode();
    }
  }
};
