
import React, { useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { recoveryModeUtils } from "./useRecoveryMode";

/**
 * Hook otimizado para handling de eventos de auth
 */
export const useAuthEventHandler = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = window.location.pathname === "/reset-password";

  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    console.log("🔄 Auth event:", event, "User:", currentSession?.user?.email);
    
    // Tratamento especial para logout
    if (event === "SIGNED_OUT") {
      console.log("🚪 Processando logout...");
      
      setSession(null);
      setUser(null);
      setLoading(false);
      
      recoveryModeUtils.clearAllRecoveryData();
      
      // Redirecionamento mais suave
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 100);
      
      return;
    }
    
    // Detectar recuperação de senha
    if (event === "PASSWORD_RECOVERY" || 
        (event === "SIGNED_IN" && currentSession?.user?.aud === "recovery") ||
        recoveryModeUtils.detectRecoveryFlow(currentSession, window.location.pathname)) {
      console.log("🔑 Modo recuperação ativo");
      recoveryModeUtils.setRecoveryMode(true);
      setSession(currentSession);
      setLoading(false);
      return;
    }
    
    // Se estiver em modo de recuperação, não fazer login automático
    if (isResetPasswordPage || recoveryModeUtils.isInRecoveryMode()) {
      console.log("🔄 Em modo recuperação - sem login automático");
      setSession(currentSession);
      setLoading(false);
      return;
    }

    // Comportamento normal
    console.log("✅ Atualizando estado normal:", {
      hasSession: !!currentSession,
      userEmail: currentSession?.user?.email
    });
    
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  }, [isResetPasswordPage]);

  return {
    user,
    session,
    loading,
    handleAuthStateChange,
  };
};
