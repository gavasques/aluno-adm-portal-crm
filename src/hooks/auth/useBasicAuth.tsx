
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CreateUserResult } from "./useBasicAuth/useAdminOperations";

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

  // Função para enviar magic link
  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${BASE_URL}/`,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Magic Link enviado com sucesso",
        description: "Verifique seu email para fazer login.",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao enviar magic link:", error);
      toast({
        title: "Erro ao enviar magic link",
        description: error.message || "Verifique seu email e tente novamente.",
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

  // Nova função para adicionar um usuário no painel de admin
  const createAdminUser = async (email: string, name: string, role: string, password: string): Promise<CreateUserResult> => {
    try {
      console.log("Criando novo usuário:", { email, name, role, password: password ? "Definida" : "Gerada automaticamente" });

      // Criar o usuário diretamente via Edge Function no Supabase
      const { data: response, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'createUser',
          email: email,
          name: name,
          role: role,
          password: password || Math.random().toString(36).slice(-10)
        }
      });

      if (error) {
        console.error("Erro na chamada da função:", error);
        throw new Error(error.message || "Erro ao adicionar usuário");
      }
      
      if (response && response.error) {
        console.error("Erro retornado pela função:", response.error);
        throw new Error(response.error);
      }
      
      // Verificar se o usuário já existe e tratar adequadamente
      if (response && response.existed) {
        toast({
          title: "Usuário já existe",
          description: `O usuário ${email} já existe no sistema, mas pode não estar visível na lista atual.`,
          variant: "default",
        });
        
        return { success: false, existed: true };
      } else {
        toast({
          title: "Usuário adicionado com sucesso",
          description: `Usuário ${email} foi criado e adicionado ao sistema.`,
        });
        
        return { success: true, existed: false };
      }
    } catch (error: any) {
      console.error("Erro ao criar usuário via admin:", error);
      toast({
        title: "Erro ao adicionar usuário",
        description: error.message || "Não foi possível adicionar o usuário. Tente novamente.",
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
    updateUserPassword,
    sendMagicLink,
    createAdminUser
  };
}
