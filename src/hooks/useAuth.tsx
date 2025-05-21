
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signInWithMagicLink: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  resetPassword: (newPassword: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Configure o listener de alteração de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Se for um evento de login, atualizar o horário de último login
        if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Usamos setTimeout para evitar problemas de deadlock com Supabase Auth
          setTimeout(() => {
            updateUserLastLogin(currentSession.user.id);
          }, 0);
        }
      }
    );

    // Verifique se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (currentSession?.user) {
        // Atualizamos o último login apenas se o usuário estiver conectado
        updateUserLastLogin(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserLastLogin = async (userId: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('profiles')
      .update({ last_login: now })
      .eq('id', userId);
    
    if (error) {
      console.error('Erro ao atualizar último login:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro de autenticação",
        description: (error as Error).message || "Falha ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Link de acesso enviado",
        description: "Verifique seu email para fazer login.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Erro ao enviar magic link:", error);
      toast({
        title: "Erro ao enviar link",
        description: (error as Error).message || "Não foi possível enviar o link de acesso.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado",
        description: "Verifique seu email para confirmar o cadastro.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: (error as Error).message || "Não foi possível completar o cadastro.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast({
        title: "Erro ao enviar email",
        description: (error as Error).message || "Não foi possível enviar o email de redefinição.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });

      // Redirecionar para o login após redefinir a senha
      setTimeout(() => {
        navigate("/");
      }, 2000);

      return { data, error: null };
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Erro ao redefinir senha",
        description: (error as Error).message || "Não foi possível redefinir sua senha.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signInWithMagicLink,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
