
import React, { useState, useEffect } from "react";
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
  const isLoginPage = location.pathname === "/";

  const handleAuthStateChange = (event: string, currentSession: Session | null) => {
    console.log("Auth event:", event, "Path:", location.pathname);
    console.log("User audience:", currentSession?.user?.aud);
    console.log("User metadata:", currentSession?.user?.user_metadata);
    
    // Detectar o máximo possível de indicadores de recuperação de senha
    if (event === "PASSWORD_RECOVERY" || 
        (event === "SIGNED_IN" && currentSession?.user?.aud === "recovery") ||
        recoveryModeUtils.detectRecoveryFlow(currentSession, location.pathname)) {
      console.log("Evento de recuperação de senha detectado");
      recoveryModeUtils.setRecoveryMode(true);
      // Apenas armazenar a sessão para poder redefinir a senha
      setSession(currentSession);
      setLoading(false);
      return;
    }
    
    // Se estiver em modo de recuperação, não fazer login automático
    // apenas armazenar a sessão para poder redefinir a senha
    if (isResetPasswordPage || recoveryModeUtils.isInRecoveryMode()) {
      console.log("Em modo de recuperação ou na página de reset - não fazendo login automático");
      setSession(currentSession);
      setLoading(false);
      return;
    }

    // Comportamento normal quando não está em recuperação de senha
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);

    if (event === "SIGNED_OUT") {
      navigate("/");
    }
    // REMOVIDO: redirecionamento automático que causava loop
    // O redirecionamento agora será feito pelo Layout baseado nas permissões
  };

  return {
    user,
    session,
    loading,
    handleAuthStateChange,
  };
};
