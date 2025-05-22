
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

// Nome da chave no localStorage para controle de estado de recuperação de senha
const RECOVERY_MODE_KEY = "supabase_recovery_mode";
const RECOVERY_EXPIRY_KEY = "supabase_recovery_expiry";
// Tempo de expiração do modo de recuperação (30 minutos em milissegundos)
const RECOVERY_TIMEOUT = 30 * 60 * 1000;

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = location.pathname === "/reset-password";

  // Função para verificar se estamos em modo de recuperação de senha
  const isInRecoveryMode = () => {
    const inRecoveryMode = localStorage.getItem(RECOVERY_MODE_KEY) === "true";
    const expiryTime = Number(localStorage.getItem(RECOVERY_EXPIRY_KEY) || "0");
    
    // Se o tempo de expiração passou, limpar o modo de recuperação
    if (inRecoveryMode && expiryTime < Date.now()) {
      localStorage.removeItem(RECOVERY_MODE_KEY);
      localStorage.removeItem(RECOVERY_EXPIRY_KEY);
      return false;
    }
    
    return inRecoveryMode;
  };

  // Função para definir o modo de recuperação
  const setRecoveryMode = (enabled: boolean) => {
    if (enabled) {
      localStorage.setItem(RECOVERY_MODE_KEY, "true");
      localStorage.setItem(RECOVERY_EXPIRY_KEY, String(Date.now() + RECOVERY_TIMEOUT));
      console.log("Modo de recuperação de senha ativado");
    } else {
      localStorage.removeItem(RECOVERY_MODE_KEY);
      localStorage.removeItem(RECOVERY_EXPIRY_KEY);
      console.log("Modo de recuperação de senha desativado");
    }
  };

  useEffect(() => {
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event, "Path:", location.pathname);
        
        // Detectar eventos de recuperação de senha em qualquer página
        if (event === "PASSWORD_RECOVERY" || 
            (event === "SIGNED_IN" && currentSession?.user?.aud === "recovery")) {
          console.log("Evento de recuperação de senha detectado");
          setRecoveryMode(true);
        }
        
        // Se estiver em modo de recuperação ou na página de reset, apenas
        // armazenar a sessão para poder redefinir a senha, mas não considerar o usuário logado
        if (isResetPasswordPage || isInRecoveryMode()) {
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
        } else if (event === "SIGNED_IN" && window.location.pathname === "/" && !isResetPasswordPage) {
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

    // Verificar se há uma sessão existente
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Se estamos na página de reset de senha ou em modo de recuperação, 
      // não autenticamos o usuário automaticamente
      if (isResetPasswordPage || isInRecoveryMode()) {
        // Apenas armazenamos a sessão para poder redefinir a senha
        console.log("Verificação de sessão - em modo de recuperação ou na página de reset");
        setSession(currentSession);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Limpar o listener quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isResetPasswordPage, location.pathname]);

  return {
    user,
    session,
    loading,
    isInRecoveryMode,
    setRecoveryMode
  };
}
