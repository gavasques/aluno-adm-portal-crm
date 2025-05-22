
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define a proper return type for the createAdminUser function
export interface CreateUserResult {
  success: boolean;
  existed: boolean;
}

export function useAdminOperations() {
  // Nova função para adicionar um usuário no painel de admin
  const createAdminUser = async (email: string, name: string, role: string, password: string): Promise<CreateUserResult> => {
    try {
      console.log("Criando novo usuário:", { email, name, role, password: password ? "Definida" : "Gerada automaticamente" });

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
        console.error("Erro na chamada da função:", error);
        throw new Error(error.message || "Erro ao adicionar usuário");
      }
      
      if (response && response.error) {
        console.error("Erro retornado pela função:", response.error);
        throw new Error(response.error);
      }
      
      // Verificar se o usuário já existe e tratar adequadamente
      if (response && response.existed) {
        toast({
          title: "Usuário já existe",
          description: `O usuário ${email} já existe no sistema, mas pode não estar visível na lista atual.`,
          variant: "default", // Usando "default" ao invés de "warning" que não é um tipo válido
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
      console.error("Erro ao criar usuário via admin:", error);
      toast({
        title: "Erro ao adicionar usuário",
        description: error.message || "Não foi possível adicionar o usuário. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { createAdminUser };
}
