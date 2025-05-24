
import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { recoveryModeUtils } from "./useRecoveryMode";

/**
 * Hook for checking the initial session state
 */
export const useInitialSession = (
  setSession: (session: any) => void,
  setUser: (user: any) => void,
  setLoading: (loading: boolean) => void
) => {
  const location = useLocation();
  const hasCheckedInitial = useRef(false);

  React.useEffect(() => {
    // Evitar verificação múltipla da sessão inicial
    if (hasCheckedInitial.current) {
      return;
    }

    const checkSession = async () => {
      console.log("Verificando sessão inicial");
      setLoading(true);
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log("Sessão existente encontrada:", !!currentSession);
        console.log("Usuário da sessão:", currentSession?.user?.email);
        console.log("Audience:", currentSession?.user?.aud);
        console.log("Localização:", location.pathname);
        
        // Detectar o máximo possível de indicadores de recuperação de senha
        if (recoveryModeUtils.detectRecoveryFlow(currentSession, location.pathname)) {
          console.log("Em fluxo de recuperação de senha - armazenando sessão mas não autenticando");
          
          if (currentSession?.user?.aud === "recovery" || 
              window.location.href.includes("type=recovery") || 
              (window.location.href.includes("access_token=") && location.pathname === "/reset-password")) {
            recoveryModeUtils.setRecoveryMode(true);
          }
          
          setSession(currentSession);
          setLoading(false);
          return;
        }

        // Comportamento normal quando não está em recuperação de senha
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        hasCheckedInitial.current = true;
      } catch (error) {
        console.error("Erro ao verificar sessão inicial:", error);
        setLoading(false);
      }
    };

    checkSession();
  }, []); // Dependência vazia para executar apenas uma vez
};
