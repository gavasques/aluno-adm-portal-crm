
// Constants for localStorage keys
export const RECOVERY_MODE_KEY = "supabase_recovery_mode";
export const RECOVERY_EXPIRY_KEY = "supabase_recovery_expiry";
// Tempo de expiração do modo de recuperação (30 minutos em milissegundos)
export const RECOVERY_TIMEOUT = 30 * 60 * 1000;

/**
 * Utility functions to manage password recovery mode
 * These help track when a user is in the process of resetting their password
 */
export const recoveryModeUtils = {
  /**
   * Check if the current session is in password recovery mode
   */
  isInRecoveryMode: (): boolean => {
    const inRecoveryMode = localStorage.getItem(RECOVERY_MODE_KEY) === "true";
    const expiryTime = Number(localStorage.getItem(RECOVERY_EXPIRY_KEY) || "0");
    
    // If the time of expiração passou, limpar o modo de recuperação
    if (inRecoveryMode && expiryTime < Date.now()) {
      localStorage.removeItem(RECOVERY_MODE_KEY);
      localStorage.removeItem(RECOVERY_EXPIRY_KEY);
      return false;
    }
    
    return inRecoveryMode;
  },

  /**
   * Set or clear the recovery mode
   */
  setRecoveryMode: (enabled: boolean): void => {
    if (enabled) {
      localStorage.setItem(RECOVERY_MODE_KEY, "true");
      localStorage.setItem(RECOVERY_EXPIRY_KEY, String(Date.now() + RECOVERY_TIMEOUT));
      console.log("Modo de recuperação de senha ativado");
    } else {
      localStorage.removeItem(RECOVERY_MODE_KEY);
      localStorage.removeItem(RECOVERY_EXPIRY_KEY);
      console.log("Modo de recuperação de senha desativado");
    }
  },

  /**
   * Detect if the current URL or session appears to be for password recovery
   */
  detectRecoveryFlow: (session: any, pathname: string): boolean => {
    const url = window.location.href;
    return !!(
      session?.user?.aud === "recovery" || 
      pathname === "/reset-password" || 
      recoveryModeUtils.isInRecoveryMode() ||
      url.includes("type=recovery") || 
      (url.includes("access_token=") && pathname === "/reset-password")
    );
  }
};
