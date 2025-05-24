
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CreateUserResult } from "./useBasicAuth/useAdminOperations";
import { useSignUp } from "./useBasicAuth/useSignUp";
import { sanitizeError, logSecureError } from "@/utils/security";

// URL base do site que será usado para redirecionamentos
const BASE_URL = "https://titan.guilhermevasques.club";

export function useBasicAuth() {
  const navigate = useNavigate();
  const { signUp: signUpUser } = useSignUp();

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
      logSecureError(error, "Magic Link");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao enviar magic link",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Usar a função de signup do hook específico
  const signUp = signUpUser;

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
      logSecureError(error, "Password Reset");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao solicitar recuperação de senha",
        description: sanitizedMessage,
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
      logSecureError(error, "Password Update");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao atualizar senha",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Nova função para adicionar um usuário no painel de admin
  const createAdminUser = async (email: string, name: string, role: string, password: string): Promise<CreateUserResult> => {
    try {
      logSecureError({ email, name, role, hasPassword: !!password }, "Creating user");

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
        logSecureError(error, "Admin User Creation - Function Error");
        throw new Error(sanitizeError(error));
      }
      
      if (response && response.error) {
        logSecureError(response.error, "Admin User Creation - Response Error");
        throw new Error(sanitizeError(response.error));
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
      logSecureError(error, "Admin User Creation");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao adicionar usuário",
        description: sanitizedMessage,
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
