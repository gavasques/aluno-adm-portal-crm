
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { recoveryModeUtils } from "./useRecoveryMode";

/**
 * Hook for handling authentication state changes
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = location.pathname === "/reset-password";
  const isLoginPage = location.pathname === "/";

  useEffect(() => {
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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
        } else if (event === "SIGNED_IN" && !isResetPasswordPage && !recoveryModeUtils.isInRecoveryMode()) {
          // Verificar o papel do usuário (admin ou aluno)
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", currentSession?.user?.id)
                .single();

              if (error) {
                console.error("Erro ao verificar o papel do usuário:", error);
                navigate("/student"); // Redirecionar para aluno por padrão
                return;
              }
              
              if (data?.role === "Admin") {
                navigate("/admin");
              } else {
                navigate("/student");
              }
            } catch (error) {
              console.error("Erro ao verificar o papel do usuário:", error);
              navigate("/student"); // Redirecionar para aluno por padrão
            }
          }, 0);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isResetPasswordPage, location.pathname, isLoginPage]);

  return {
    user,
    session,
    loading,
  };
};
