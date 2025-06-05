
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
  }
};
