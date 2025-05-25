
import React, { useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { recoveryModeUtils } from "./useRecoveryMode";

/**
 * Hook for handling authentication events
 */
export const useAuthEventHandler = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = location.pathname === "/reset-password";

  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    console.log("=== AUTH EVENT DEBUG ===");
    console.log("Event:", event);
    console.log("Path:", location.pathname);
    console.log("User email:", currentSession?.user?.email);
    console.log("User ID:", currentSession?.user?.id);
    console.log("Session exists:", !!currentSession);
    console.log("User audience:", currentSession?.user?.aud);
    console.log("========================");
    
    // Tratamento especial para logout
    if (event === "SIGNED_OUT") {
      console.log("=== PROCESSANDO LOGOUT ===");
      
      // Limpar completamente o estado
      setSession(null);
      setUser(null);
      setLoading(false);
      
      // Limpar modo de recuperação e qualquer estado local
      recoveryModeUtils.clearAllRecoveryData();
      
      console.log("Estado limpo, redirecionando para home");
      
      // Forçar redirecionamento para a página inicial
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
      
      return;
    }
    
    // Detectar o máximo possível de indicadores de recuperação de senha
    if (event === "PASSWORD_RECOVERY" || 
        (event === "SIGNED_IN" && currentSession?.user?.aud === "recovery") ||
        recoveryModeUtils.detectRecoveryFlow(currentSession, location.pathname)) {
      console.log("Evento de recuperação de senha detectado");
      recoveryModeUtils.setRecoveryMode(true);
      setSession(currentSession);
      setLoading(false);
      return;
    }
    
    // Se estiver em modo de recuperação, não fazer login automático
    if (isResetPasswordPage || recoveryModeUtils.isInRecoveryMode()) {
      console.log("Em modo de recuperação ou na página de reset - não fazendo login automático");
      setSession(currentSession);
      setLoading(false);
      return;
    }

    // Comportamento normal quando não está em recuperação de senha
    console.log("Atualizando estado de autenticação:", {
      hasSession: !!currentSession,
      userEmail: currentSession?.user?.email,
      userId: currentSession?.user?.id
    });
    
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  }, [location.pathname, isResetPasswordPage, navigate]);

  return {
    user,
    session,
    loading,
    handleAuthStateChange,
  };
};
