
import { Provider, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeError, logSecureError } from "@/utils/security";

export function useSocialAuth(user: User | null) {
  // Função para login com Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      logSecureError(error, "Google Sign In");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao fazer login com Google",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para vincular identidade
  const linkIdentity = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      toast({
        title: "Conta vinculada com sucesso",
        description: `Sua conta ${provider} foi vinculada.`,
        variant: "default",
      });
    } catch (error: any) {
      logSecureError(error, "Link Identity");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao vincular conta",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para desvincular identidade
  const unlinkIdentity = async (provider: Provider, identity_id: string) => {
    try {
      const { error } = await supabase.auth.unlinkIdentity({
        identity_id
      });

      if (error) throw error;
      
      toast({
        title: "Conta desvinculada com sucesso",
        description: `Sua conta ${provider} foi desvinculada.`,
        variant: "default",
      });
    } catch (error: any) {
      logSecureError(error, "Unlink Identity");
      const sanitizedMessage = sanitizeError(error);
      
      toast({
        title: "Erro ao desvincular conta",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para obter identidades vinculadas
  const getLinkedIdentities = () => {
    if (!user?.identities) return null;
    
    return user.identities.map(identity => ({
      id: identity.id,
      provider: identity.provider
    }));
  };

  return {
    signInWithGoogle,
    linkIdentity,
    unlinkIdentity,
    getLinkedIdentities
  };
}
