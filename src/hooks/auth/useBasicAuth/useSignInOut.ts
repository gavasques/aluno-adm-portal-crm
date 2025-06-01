
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { sanitizeError, logSecureError } from "@/utils/security";

export function useSignInOut() {
  const navigate = useNavigate();

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        variant: "default",
      });

      // Redirecionar para CRM após login bem-sucedido
      navigate('/admin/crm', { replace: true });

    } catch (error: any) {
      logSecureError(error, "Login");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao fazer login",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso",
        variant: "default",
      });
      
      // Limpar qualquer modo de recuperação ao fazer logout
      localStorage.removeItem("supabase_recovery_mode");
      localStorage.removeItem("supabase_recovery_expiry");
      
      navigate("/");
    } catch (error: any) {
      logSecureError(error, "Logout");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao fazer logout",
        description: sanitizedMessage,
        variant: "destructive",
      });
    }
  };

  return {
    signIn,
    signOut,
  };
}
