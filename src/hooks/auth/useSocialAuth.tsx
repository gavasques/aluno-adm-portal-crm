
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// URL base do site que será usado para redirecionamentos
const BASE_URL = window.location.origin;

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
      toast.error("Erro ao fazer login com Google");
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
      
      toast.success(`Conta vinculada ao ${provider} com sucesso`);
    } catch (error: any) {
      console.error(`Erro ao vincular conta com ${provider}:`, error);
      toast.error("Erro ao vincular conta");
      throw error;
    }
  };

  // Função para desvincular identidade
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
      
      // Usa o objeto de identidade completo
      const { error } = await supabase.auth.unlinkIdentity(identityToUnlink);
      
      if (error) throw error;
      
      toast.success("Conta desvinculada com sucesso");
    } catch (error: any) {
      console.error(`Erro ao desvincular identidade:`, error);
      toast.error("Erro ao desvincular conta");
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
