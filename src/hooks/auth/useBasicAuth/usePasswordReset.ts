
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BASE_URL } from "./constants";

export function usePasswordReset() {
  // Função para recuperação de senha com logging detalhado
  const resetPassword = async (email: string) => {
    console.log("=== usePasswordReset.resetPassword ===");
    console.log("Email:", email);
    console.log("BASE_URL:", BASE_URL);
    
    try {
      const redirectUrl = `${BASE_URL}/reset-password?type=recovery`;
      console.log("Redirect URL configurada:", redirectUrl);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      console.log("Resposta do resetPasswordForEmail:", { data, error });
      
      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }
      
      console.log("Email de recuperação enviado com sucesso");
      
      toast({
        title: "Link de recuperação enviado",
        description: "Verifique seu email para redefinir sua senha.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast({
        title: "Erro ao solicitar recuperação de senha",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para atualizar a senha do usuário
  const updateUserPassword = async (newPassword: string): Promise<void> => {
    console.log("=== updateUserPassword ===");
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Erro ao atualizar senha:", error);
        throw error;
      }

      console.log("Senha atualizada com sucesso");
      
      // Limpar o modo de recuperação ao atualizar a senha com sucesso
      localStorage.removeItem("supabase_recovery_mode");
      localStorage.removeItem("supabase_recovery_expiry");
      
      toast({
        title: "Senha atualizada com sucesso",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { resetPassword, updateUserPassword };
}
