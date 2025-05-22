
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BASE_URL } from "./constants";

export function useSignUp() {
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

  return { signUp };
}
