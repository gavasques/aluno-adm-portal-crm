
import { useEffect } from "react";
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Log de informações para diagnóstico
      console.log("Verificando sessão existente", currentSession);
      console.log("Usuário da sessão:", currentSession?.user);
      console.log("Audience:", currentSession?.user?.aud);
      console.log("Localização:", location.pathname);
      console.log("URL completa:", window.location.href);
      console.log("isInRecoveryMode:", recoveryModeUtils.isInRecoveryMode());
      
      // Detectar o máximo possível de indicadores de recuperação de senha
      if (recoveryModeUtils.detectRecoveryFlow(currentSession, location.pathname)) {
        console.log("Em fluxo de recuperação de senha - armazenando sessão mas não autenticando");
        
        // Se detectamos um fluxo de recuperação, ativar modo de recuperação global
        if (currentSession?.user?.aud === "recovery" || 
            window.location.href.includes("type=recovery") || 
            (window.location.href.includes("access_token=") && location.pathname === "/reset-password")) {
          recoveryModeUtils.setRecoveryMode(true);
        }
        
        // Apenas armazenamos a sessão para poder redefinir a senha
        setSession(currentSession);
        setLoading(false);
        return;
      }

      // Comportamento normal quando não está em recuperação de senha
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    checkSession();
  }, [location.pathname, setLoading, setSession, setUser]);
};
