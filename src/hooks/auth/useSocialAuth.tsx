
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// URL base do site que será usado para redirecionamentos
const BASE_URL = "https://titan.guilhermevasques.club";

export function useSocialAuth(user: User | null) {
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
  const linkIdentity = async (provider: 'google') => {
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

  // Função para desvincular identidade - corrigida para usar o objeto UserIdentity completo
  const unlinkIdentity = async (provider: string, identity_id: string) => {
    try {
      // Obtém todas as identidades do usuário
      const identities = user?.identities || [];
      
      // Encontra a identidade específica a ser desvinculada
      const identityToUnlink = identities.find(identity => 
        identity.identity_id === identity_id && identity.provider === provider
      );
      
      if (!identityToUnlink) {
        throw new Error("Identidade não encontrada para desvinculação");
      }
      
      // Usa o objeto de identidade completo que atende ao tipo UserIdentity
      const { error } = await supabase.auth.unlinkIdentity(identityToUnlink);
      
      if (error) throw error;
      
      toast({
        title: "Conta desvinculada com sucesso",
        description: `Conta desvinculada.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error(`Erro ao desvincular identidade:`, error);
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
    return user.identities?.map(({ identity_id, provider }) => ({
      id: identity_id,
      provider
    })) ?? [];
  };

  return {
    signInWithGoogle,
    linkIdentity,
    unlinkIdentity,
    getLinkedIdentities
  };
}
