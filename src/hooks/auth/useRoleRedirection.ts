
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

/**
 * Hook for handling user role-based redirections
 */
export const useRoleRedirection = () => {
  const navigate = useNavigate();

  const redirectBasedOnRole = async (user: User, session: Session) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao verificar o papel do usuário:", error);
        navigate("/aluno"); // Redirecionar para aluno por padrão
        return;
      }
      
      if (data?.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/aluno");
      }
    } catch (error) {
      console.error("Erro ao verificar o papel do usuário:", error);
      navigate("/aluno"); // Redirecionar para aluno por padrão
    }
  };

  return { redirectBasedOnRole };
};
