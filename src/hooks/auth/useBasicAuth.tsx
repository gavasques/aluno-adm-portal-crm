
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// URL base do site que será usado para redirecionamentos
const BASE_URL = "https://titan.guilhermevasques.club";

export function useBasicAuth() {
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

    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para cadastro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${BASE_URL}/reset-password`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar o cadastro.",
        variant: "default",
      });

    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Verifique os dados informados e tente novamente.",
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
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Função para recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      // Certifica-se de redirecionar especificamente para a página de reset de senha
      // com um parâmetro que pode ser verificado
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/reset-password?reset_token=true`,
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

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword
  };
}
