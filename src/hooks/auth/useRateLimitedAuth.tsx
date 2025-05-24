
import { useState, useCallback } from "react";
import { useBasicAuth } from "./useBasicAuth";
import { loginRateLimiter, passwordResetRateLimiter, magicLinkRateLimiter } from "@/utils/rate-limiting";
import { logLoginAttempt, logPasswordReset, logMagicLink } from "@/utils/audit-logger";
import { toast } from "@/hooks/use-toast";

export const useRateLimitedAuth = () => {
  const basicAuth = useBasicAuth();
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const checkRateLimit = useCallback((rateLimiter: any, action: string) => {
    const status = rateLimiter.isBlocked();
    
    if (status.blocked) {
      setIsRateLimited(true);
      setRemainingTime(status.timeRemaining || 0);
      
      const minutes = Math.ceil((status.timeRemaining || 0) / 60);
      toast({
        title: "Muitas tentativas",
        description: `Aguarde ${minutes} minuto(s) antes de tentar novamente.`,
        variant: "destructive",
      });
      
      return false;
    }
    
    setIsRateLimited(false);
    return true;
  }, []);

  const rateLimitedSignIn = useCallback(async (email: string, password: string) => {
    // Verificar rate limit
    if (!checkRateLimit(loginRateLimiter, 'login')) {
      return;
    }

    // Aplicar backoff delay se necessário
    const delay = loginRateLimiter.getBackoffDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      await basicAuth.signIn(email, password);
      
      // Login bem-sucedido - resetar contador
      loginRateLimiter.reset();
      logLoginAttempt(email, true);
      
    } catch (error: any) {
      // Registrar tentativa falha
      loginRateLimiter.recordAttempt();
      logLoginAttempt(email, false, error.message);
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const rateLimitedResetPassword = useCallback(async (email: string) => {
    // Verificar rate limit
    if (!checkRateLimit(passwordResetRateLimiter, 'password_reset')) {
      return;
    }

    try {
      await basicAuth.resetPassword(email);
      
      // Reset bem-sucedido
      logPasswordReset(email, true);
      
    } catch (error: any) {
      // Registrar tentativa falha
      passwordResetRateLimiter.recordAttempt();
      logPasswordReset(email, false, error.message);
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const rateLimitedSendMagicLink = useCallback(async (email: string) => {
    // Verificar rate limit
    if (!checkRateLimit(magicLinkRateLimiter, 'magic_link')) {
      return false;
    }

    try {
      const result = await basicAuth.sendMagicLink(email);
      
      // Magic link enviado com sucesso
      logMagicLink(email, true);
      
      return result;
    } catch (error: any) {
      // Registrar tentativa falha
      magicLinkRateLimiter.recordAttempt();
      logMagicLink(email, false, error.message);
      
      throw error;
    }
  }, [basicAuth, checkRateLimit]);

  const getRemainingAttempts = useCallback((action: 'login' | 'password_reset' | 'magic_link') => {
    const rateLimiter = {
      login: loginRateLimiter,
      password_reset: passwordResetRateLimiter,
      magic_link: magicLinkRateLimiter
    }[action];

    const status = rateLimiter.isBlocked();
    return status.attemptsRemaining || 0;
  }, []);

  return {
    ...basicAuth,
    signIn: rateLimitedSignIn,
    resetPassword: rateLimitedResetPassword,
    sendMagicLink: rateLimitedSendMagicLink,
    isRateLimited,
    remainingTime,
    getRemainingAttempts
  };
};
