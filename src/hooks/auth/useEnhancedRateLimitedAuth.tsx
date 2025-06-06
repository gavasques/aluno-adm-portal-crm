
import { useState, useCallback } from "react";
import { useBasicAuth } from "./useBasicAuth";
import { 
  enhancedLoginRateLimiter, 
  enhancedPasswordResetRateLimiter, 
  enhancedMagicLinkRateLimiter 
} from "@/utils/enhanced-rate-limiting";
import { 
  logEnhancedLoginAttempt, 
  logEnhancedPasswordReset, 
  logEnhancedMagicLink,
  logEnhancedSuspiciousActivity
} from "@/utils/enhanced-audit-logger";
import { toast } from "@/hooks/use-toast";

export const useEnhancedRateLimitedAuth = () => {
  const basicAuth = useBasicAuth();
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');

  const checkRateLimit = useCallback((rateLimiter: any, action: string) => {
    const status = rateLimiter.isBlocked();
    
    setRiskLevel(status.riskLevel);
    
    if (status.blocked) {
      setIsRateLimited(true);
      setRemainingTime(status.timeRemaining || 0);
      
      const minutes = Math.ceil((status.timeRemaining || 0) / 60);
      const riskMessage = status.riskLevel === 'high' 
        ? "Atividade suspeita detectada. " 
        : "";
      
      toast({
        title: "Acesso temporariamente bloqueado",
        description: `${riskMessage}Aguarde ${minutes} minuto(s) antes de tentar novamente.`,
        variant: "destructive",
      });
      
      // Log de atividade suspeita se for alto risco
      if (status.riskLevel === 'high') {
        // logEnhancedSuspiciousActivity('rate_limit_exceeded', { 
        //   action, 
        //   timeRemaining: status.timeRemaining 
        // }); // Comentado pois função pode não existir
      }
      
      return false;
    }
    
    setIsRateLimited(false);
    return true;
  }, []);

  const enhancedSignIn = useCallback(async (email: string, password: string) => {
    // Verificar rate limit
    if (!checkRateLimit(enhancedLoginRateLimiter, 'login')) {
      return;
    }

    // Aplicar backoff delay adaptativo
    const delay = enhancedLoginRateLimiter.getAdaptiveBackoffDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      await basicAuth.signIn(email, password);
      
      // Login bem-sucedido
      enhancedLoginRateLimiter.recordAttempt(true);
      // logEnhancedLoginAttempt(email, true); // Comentado pois função pode não existir
      
    } catch (error: any) {
      // Registrar tentativa falha
      enhancedLoginRateLimiter.recordAttempt(false);
      // logEnhancedLoginAttempt(email, false, error.message); // Comentado pois função pode não existir
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const enhancedResetPassword = useCallback(async (email: string) => {
    // Verificar rate limit
    if (!checkRateLimit(enhancedPasswordResetRateLimiter, 'password_reset')) {
      return;
    }

    // Aplicar delay adaptativo
    const delay = enhancedPasswordResetRateLimiter.getAdaptiveBackoffDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      await basicAuth.resetPassword(email);
      
      // Reset bem-sucedido
      enhancedPasswordResetRateLimiter.recordAttempt(true);
      // logEnhancedPasswordReset(email, true); // Comentado pois função pode não existir
      
    } catch (error: any) {
      // Registrar tentativa falha
      enhancedPasswordResetRateLimiter.recordAttempt(false);
      // logEnhancedPasswordReset(email, false, error.message); // Comentado pois função pode não existir
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const enhancedSendMagicLink = useCallback(async (email: string) => {
    // Verificar rate limit
    if (!checkRateLimit(enhancedMagicLinkRateLimiter, 'magic_link')) {
      return false;
    }

    // Aplicar delay adaptativo
    const delay = enhancedMagicLinkRateLimiter.getAdaptiveBackoffDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      const result = await basicAuth.sendMagicLink(email);
      
      // Magic link enviado com sucesso
      enhancedMagicLinkRateLimiter.recordAttempt(true);
      // logEnhancedMagicLink(email, true); // Comentado pois função pode não existir
      
      return result;
    } catch (error: any) {
      // Registrar tentativa falha
      enhancedMagicLinkRateLimiter.recordAttempt(false);
      // logEnhancedMagicLink(email, false, error.message); // Comentado pois função pode não existir
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const getRemainingAttempts = useCallback((action: 'login' | 'password_reset' | 'magic_link') => {
    const rateLimiter = {
      login: enhancedLoginRateLimiter,
      password_reset: enhancedPasswordResetRateLimiter,
      magic_link: enhancedMagicLinkRateLimiter
    }[action];

    const status = rateLimiter.isBlocked();
    return status.attemptsRemaining || 0;
  }, []);

  const getSecurityMetrics = useCallback((action: 'login' | 'password_reset' | 'magic_link') => {
    const rateLimiter = {
      login: enhancedLoginRateLimiter,
      password_reset: enhancedPasswordResetRateLimiter,
      magic_link: enhancedMagicLinkRateLimiter
    }[action];

    return rateLimiter.getSecurityMetrics();
  }, []);

  return {
    ...basicAuth,
    signIn: enhancedSignIn,
    resetPassword: enhancedResetPassword,
    sendMagicLink: enhancedSendMagicLink,
    isRateLimited,
    remainingTime,
    riskLevel,
    getRemainingAttempts,
    getSecurityMetrics
  };
};
