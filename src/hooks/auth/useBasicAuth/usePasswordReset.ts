
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BASE_URL } from "./constants";

export function usePasswordReset() {
  // Função para recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      // Certificar-se que o link de redefinição contém parâmetros específicos 
      // Importante: incluir ?type=recovery para facilitar a detecção do fluxo
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/reset-password?type=recovery`,
      });
      
      if (error) throw error;
      
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
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

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
