
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { recoveryModeUtils } from "../useRecoveryMode";

export function useSignInOut() {
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

  // Função para logout melhorada
  const signOut = async () => {
    try {
      console.log("=== INICIANDO LOGOUT ===");
      
      // Primeiro, limpar todos os dados locais
      recoveryModeUtils.clearAllRecoveryData();
      
      // Limpar outros dados do localStorage relacionados à autenticação
      const keysToRemove = [
        "supabase.auth.token",
        "sb-qflmguzmticupqtnlirf-auth-token",
        "sb-auth-token"
      ];
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Erro ao limpar ${key}:`, e);
        }
      });
      
      console.log("Dados locais limpos, fazendo logout no Supabase...");
      
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro no logout do Supabase:", error);
        throw error;
      }
      
      console.log("Logout no Supabase concluído com sucesso");
      
      toast({
        title: "Logout realizado com sucesso",
        variant: "default",
      });
      
      console.log("Redirecionando para página inicial...");
      
      // Redirecionar imediatamente
      navigate("/", { replace: true });
      
      console.log("=== LOGOUT CONCLUÍDO ===");
      
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
      
      // Mesmo com erro, tentar limpar e redirecionar
      try {
        recoveryModeUtils.clearAllRecoveryData();
        navigate("/", { replace: true });
      } catch (redirectError) {
        console.error("Erro ao redirecionar após falha no logout:", redirectError);
      }
    }
  };

  return { signIn, signOut };
}
