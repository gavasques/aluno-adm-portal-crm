
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (event === "SIGNED_OUT") {
          navigate("/");
        } else if (event === "SIGNED_IN" && window.location.pathname === "/") {
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
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Limpar o listener quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    user,
    session,
    loading
  };
}
