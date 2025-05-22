
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BASE_URL } from "./constants";

export function useMagicLink() {
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

  return { sendMagicLink };
}
