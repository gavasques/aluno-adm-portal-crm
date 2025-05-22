
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = location.pathname === "/reset-password";

  useEffect(() => {
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event, "Path:", location.pathname);
        
        // Se estamos na página de reset de senha e o evento for uma recuperação, 
        // não definimos o usuário completo ainda
        if (isResetPasswordPage && (
          event === "PASSWORD_RECOVERY" || 
          event === "SIGNED_IN" || 
          event === "TOKEN_REFRESHED"
        )) {
          // Armazenamos a sessão para poder redefinir a senha, mas não consideramos o usuário logado
          setSession(currentSession);
          setLoading(false);
          return;
        }

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
      
      // Se estamos na página de reset de senha, não autenticamos o usuário automaticamente
      if (isResetPasswordPage) {
        // Apenas armazenamos a sessão para poder redefinir a senha
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
    loading
  };
}
