
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBasicAuth = () => {
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔐 Fazendo login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        throw error;
      }

      console.log('✅ Login realizado com sucesso');
      // Não fazer redirecionamento aqui, deixar o AuthTabs gerenciar
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      console.log('📝 Criando conta...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Erro no signup:', error);
        throw error;
      }

      console.log('✅ Conta criada com sucesso');
      toast.success('Conta criada! Verifique seu email.');
    } catch (error: any) {
      console.error('❌ Erro no signup:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
        throw error;
      }

      console.log('✅ Logout realizado com sucesso');
      // Redirecionamento será feito automaticamente pelo AuthProvider
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('🔄 Enviando reset de senha...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('❌ Erro no reset:', error);
        throw error;
      }

      console.log('✅ Email de reset enviado');
    } catch (error: any) {
      console.error('❌ Erro no reset:', error);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    try {
      console.log('🔒 Atualizando senha...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        throw error;
      }

      console.log('✅ Senha atualizada com sucesso');
      toast.success('Senha atualizada com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar senha:', error);
      throw error;
    }
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    try {
      console.log('🔗 Enviando magic link...');
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Erro ao enviar magic link:', error);
        throw error;
      }

      console.log('✅ Magic link enviado');
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar magic link:', error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword,
    sendMagicLink
  };
};
