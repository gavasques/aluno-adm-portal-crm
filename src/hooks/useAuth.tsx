
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// URL base do site que será usado para redirecionamentos
const BASE_URL = "https://titan.guilhermevasques.club";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  linkIdentity: (provider: Provider) => Promise<void>;
  unlinkIdentity: (provider: Provider, id: string) => Promise<void>;
  getLinkedIdentities: () => Array<{id: string, provider: string}> | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/reset-password`,
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

      // Após atualizar a senha com sucesso, podemos atualizar o estado local se necessário
      console.log("Senha atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      throw error;
    }
  };

  // Função para login com Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${BASE_URL}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message || "Ocorreu um erro ao tentar fazer login com o Google.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para vincular identidade (Google ou outro provedor)
  const linkIdentity = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider
      });
      
      if (error) throw error;
      
      toast({
        title: "Conta vinculada com sucesso",
        description: `Sua conta foi vinculada ao provedor ${provider}.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error(`Erro ao vincular conta com ${provider}:`, error);
      toast({
        title: "Erro ao vincular conta",
        description: error.message || "Ocorreu um erro ao tentar vincular sua conta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para desvincular identidade
  const unlinkIdentity = async (provider: Provider, id: string) => {
    try {
      const { error } = await supabase.auth.unlinkIdentity({
        id,
        user_id: user?.id || '',
        provider,
      });
      
      if (error) throw error;
      
      toast({
        title: "Conta desvinculada com sucesso",
        description: `Sua conta foi desvinculada do provedor ${provider}.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error(`Erro ao desvincular conta com ${provider}:`, error);
      toast({
        title: "Erro ao desvincular conta",
        description: error.message || "Ocorreu um erro ao tentar desvincular sua conta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para obter identidades vinculadas
  const getLinkedIdentities = () => {
    if (!user) return null;
    return user.identities;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserPassword,
        signInWithGoogle,
        linkIdentity,
        unlinkIdentity,
        getLinkedIdentities,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
